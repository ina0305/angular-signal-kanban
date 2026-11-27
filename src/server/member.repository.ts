import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { SQLOutputValue } from 'node:sqlite';
import { dirname, join } from 'node:path';
import type {
  MemberCreateInput,
  MemberInfo,
} from '../app/layout/models/member.model';

// Angular SSR 會打包 server code；用 createRequire 在執行時載入 Node 內建的 SQLite。
const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite');

// 可用 DATABASE_PATH 指定資料庫位置；未設定時存到專案的 data 目錄。
const databasePath =
  process.env['DATABASE_PATH'] ?? join(process.cwd(), 'data', 'members.sqlite');

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);

// 建立會員資料表；app_metadata 用來記錄示範資料是否已初始化。
database.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    gender TEXT NOT NULL,
    birth TEXT,
    role TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
    createTime TEXT NOT NULL,
    language TEXT,
    timeZone TEXT,
    note TEXT
  );
  CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`);

const seedMembers: MemberInfo[] = [
  {
    id: 'mem_001',
    firstName: 'Olivia',
    lastName: 'Ryhe',
    email: 'olivia@company.com',
    role: 'admin',
    status: 'active',
    gender: 'female',
    createTime: '2026-11-02 11:22 (Taipei)',
    language: 'en_US',
    timeZone: 'utc8',
  },
  {
    id: 'mem_002',
    firstName: 'Alex',
    lastName: 'Miller',
    email: 'alex.m@company.com',
    role: 'editor',
    status: 'active',
    gender: 'male',
    createTime: '2026-11-01 10:47 (Taipei)',
    language: 'en_US',
    timeZone: 'utc8',
  },
  {
    id: 'mem_003',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.c@company.com',
    role: 'viewer',
    status: 'inactive',
    gender: 'female',
    createTime: '2026-11-1 16:41 (Taipei)',
    language: 'en_US',
    timeZone: 'utc8',
  },
  {
    id: 'mem_004',
    firstName: 'Tom',
    lastName: 'Hardy',
    email: 'tom.h@company.com',
    role: 'viewer',
    status: 'pending',
    gender: 'male',
    createTime: '2026-10-29 14:02 (Taipei)',
    language: 'en_US',
    timeZone: 'utc8',
  },
];

// 只在第一次啟動時匯入前端原本的示範會員，避免刪除後重啟又被加回來。
// 這些資料只用來讓第一次啟動時有可查看的會員範例。
// 使用 SQL 參數傳入欄位值，不把會員輸入直接串接進 SQL。
const insertMember = database.prepare(`
  INSERT OR IGNORE INTO members
    (id, firstName, lastName, email, phone, gender, birth, role, status, createTime, language, timeZone, note)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedMarker = database
  .prepare('SELECT value FROM app_metadata WHERE key = ?')
  .get('members_seed_v1');

if (!seedMarker) {
  // 將示範資料與初始化標記放在同一個交易，避免只寫入一部分。
  database.exec('BEGIN');
  try {
    for (const member of seedMembers) {
      insertMember.run(
        member.id,
        member.firstName,
        member.lastName,
        member.email,
        member.phone ?? null,
        member.gender,
        member.birth ?? null,
        member.role,
        member.status,
        member.createTime,
        member.language ?? null,
        member.timeZone ?? null,
        member.note ?? null,
      );
    }

    database
      .prepare('INSERT INTO app_metadata (key, value) VALUES (?, ?)')
      .run('members_seed_v1', 'true');
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

function getString(row: Record<string, SQLOutputValue>, key: string): string {
  const value = row[key];
  if (typeof value !== 'string') {
    throw new Error(`Invalid member database value for ${key}`);
  }
  return value;
}

// SQLite 欄位可能是 NULL；API 物件使用 optional 欄位時就回傳 undefined。
function getOptionalString(
  row: Record<string, SQLOutputValue>,
  key: string,
): string | undefined {
  const value = row[key];
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`Invalid member database value for ${key}`);
  }
  return value;
}

// 將 SQLite 查詢結果轉成前端使用的會員物件，並檢查必要欄位型別。
function toMember(row: Record<string, SQLOutputValue>): MemberInfo {
  const status = getString(row, 'status');
  if (status !== 'active' && status !== 'inactive' && status !== 'pending') {
    throw new Error('Invalid member database value for status');
  }

  return {
    id: getString(row, 'id'),
    firstName: getString(row, 'firstName'),
    lastName: getString(row, 'lastName'),
    email: getString(row, 'email'),
    phone: getOptionalString(row, 'phone'),
    gender: getString(row, 'gender'),
    birth: getOptionalString(row, 'birth'),
    role: getString(row, 'role'),
    status,
    createTime: getString(row, 'createTime'),
    language: getOptionalString(row, 'language'),
    timeZone: getOptionalString(row, 'timeZone'),
    note: getOptionalString(row, 'note'),
  };
}

// 讀取所有會員，並轉成前端共用的 MemberInfo 格式。
export function listMembers(): MemberInfo[] {
  return database
    .prepare('SELECT * FROM members ORDER BY createTime DESC, id')
    .all()
    .map(toMember);
}

export function createMember(input: MemberCreateInput): MemberInfo {
  // ID 與建立時間由 server 產生，前端只需傳送表單欄位。
  const member: MemberInfo = {
    ...input,
    id: `mem_${randomUUID()}`,
    createTime: `${new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date())} (Taipei)`,
  };

  database
    .prepare(
      `
      INSERT INTO members
        (id, firstName, lastName, email, phone, gender, birth, role, status, createTime, language, timeZone, note)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      member.id,
      member.firstName,
      member.lastName,
      member.email,
      member.phone ?? null,
      member.gender,
      member.birth ?? null,
      member.role,
      member.status,
      member.createTime,
      member.language ?? null,
      member.timeZone ?? null,
      member.note ?? null,
    );

  return member;
}

export function deleteMember(id: string): boolean {
  const result = database.prepare('DELETE FROM members WHERE id = ?').run(id);
  // 回傳是否真的刪到資料，讓 API 可以區分成功與 404。
  return Number(result.changes) > 0;
}
