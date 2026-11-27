import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import {
  createMember,
  deleteMember,
  listMembers,
} from './server/member.repository';
import type {
  MemberCreateInput,
  MemberStatus,
} from './app/layout/models/member.model';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// API 只接受小型 JSON 表單，避免收到過大的 request body。
app.use(express.json({ limit: '16kb' }));

// Express 的 request body 型別較寬；先用這些 helper 驗證外部傳入的資料。
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getRequiredString(
  body: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = body[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getOptionalString(
  body: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = body[key];
  return typeof value === 'string' && value ? value : undefined;
}

function isMemberStatus(value: string): value is MemberStatus {
  return value === 'active' || value === 'inactive' || value === 'pending';
}

function parseMemberInput(value: unknown): MemberCreateInput | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const firstName = getRequiredString(value, 'firstName');
  const lastName = getRequiredString(value, 'lastName');
  const email = getRequiredString(value, 'email');
  const gender = getRequiredString(value, 'gender');
  const role = getRequiredString(value, 'role');
  const status = getRequiredString(value, 'status');
  const optionalKeys = ['phone', 'birth', 'language', 'timeZone', 'note'];

  if (
    !firstName ||
    !lastName ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !gender ||
    !role ||
    !status ||
    !isMemberStatus(status) ||
    optionalKeys.some(
      (key) =>
        value[key] !== undefined &&
        value[key] !== null &&
        typeof value[key] !== 'string',
    )
  ) {
    return undefined;
  }

  return {
    firstName,
    lastName,
    email,
    gender,
    role,
    status,
    phone: getOptionalString(value, 'phone'),
    birth: getOptionalString(value, 'birth'),
    language: getOptionalString(value, 'language'),
    timeZone: getOptionalString(value, 'timeZone'),
    note: getOptionalString(value, 'note'),
  };
}

// API 路由要放在靜態檔案與 Angular SSR fallback 之前，否則會被當成頁面處理。
// 取得 SQLite 內目前所有會員。
app.get('/api/members', (_req, res, next) => {
  try {
    res.json(listMembers());
  } catch (error) {
    next(error);
  }
});

// 先驗證 request body，再把有效資料交給 repository 寫入資料庫。
app.post('/api/members', (req, res, next) => {
  const input = parseMemberInput(req.body);

  if (!input) {
    res.status(400).json({ error: 'Invalid member data.' });
    return;
  }

  try {
    // Repository 會在寫入時補上 id 和 createTime。
    res.status(201).json(createMember(input));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('UNIQUE constraint failed: members.email')
    ) {
      res
        .status(409)
        .json({ error: 'A member with this email already exists.' });
      return;
    }
    next(error);
  }
});

// 刪除不存在的 ID 時回 404；成功時以 204 表示沒有 response body。
app.delete('/api/members/:id', (req, res, next) => {
  try {
    if (!deleteMember(req.params['id'])) {
      res.status(404).json({ error: 'Member not found.' });
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// 未實作的 /api 路徑回傳 JSON 404，不交給 Angular 顯示頁面。
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

app.use(
  '/api',
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    // API 發生錯誤時維持 JSON response；伺服器錯誤另外記錄在 log。
    const status =
      isRecord(error) && typeof error['status'] === 'number'
        ? error['status']
        : 500;
    const isClientError = status >= 400 && status < 500;

    if (!isClientError) {
      console.error('API request failed:', error);
    }

    res.status(isClientError ? status : 500).json({
      error: isClientError ? 'Invalid API request.' : 'Internal server error.',
    });
  },
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
