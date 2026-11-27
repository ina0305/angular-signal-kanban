import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];

/*
切回原本的 SSR / prerender 模式時，改用以下設定：

export const serverRoutes: ServerRoute[] = [
  {
    path: 'members/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
*/
