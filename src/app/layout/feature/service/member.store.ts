import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

// PrimeNg
import { MenuItem } from 'primeng/api';

// Route
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Rxjs
import { filter, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberCreateInput, MemberInfo } from '../../models/member.model';
import { MemberService } from './member.service';

// 定義 Store 的資料結構
export const MemberStore = signalStore(
  { providedIn: 'root' },
  withState({
    // 會員清單啟動時由 API 載入，不再用前端假資料。
    items: [] as MemberInfo[],
    breadcrumbs: [] as MenuItem[],
    adminInfo: {
      name: '系統管理員',
      email: 'admin@example.com',
      dept: '研發部',
      lastLogin: '2026-11-02 11:47 (Taipei)',
    },
  }),
  withHooks({
    onInit(store) {
      // 透過 inject 拿到 Angular 路由工具
      const router = inject(Router);
      const activatedRoute = inject(ActivatedRoute);
      const translate = inject(TranslateService);
      const memberService = inject(MemberService);

      const updateBreadcrumbs = () => {
        let route = activatedRoute?.root;
        while (route?.firstChild) {
          route = route.firstChild;
        }

        const breadcrumbData =
          (route?.snapshot?.data['breadcrumb'] as
            { key: string }[] | undefined) ?? [];

        patchState(store, {
          breadcrumbs: breadcrumbData.map(({ key }) => ({
            label: translate.instant(key),
          })),
        });
      };

      router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntilDestroyed(),
        )
        .subscribe(updateBreadcrumbs);

      translate.onLangChange
        .pipe(takeUntilDestroyed())
        .subscribe(updateBreadcrumbs);

      updateBreadcrumbs();

      // SSR 沒有瀏覽器 origin，會員 API 請求只在 browser 啟動。
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        memberService
          .getMemberList()
          .pipe(takeUntilDestroyed())
          .subscribe({
            next: (items) => patchState(store, { items }),
            error: (error) => console.error('Failed to load members:', error),
          });
      }
    },
  }),
  withMethods((store, apiService = inject(MemberService)) => ({
    async createMember(newMember: MemberCreateInput) {
      // 等 server 寫入成功後才更新畫面，避免顯示未儲存的資料。
      const createdMember = await firstValueFrom(
        apiService.createMember(newMember),
      );
      patchState(store, (state) => ({
        items: [...state.items, createdMember],
      }));
    },

    async deleteMember(targetId: string) {
      // 刪除成功後才從 signal 清單移除；失敗會交由呼叫端處理。
      await firstValueFrom(apiService.deleteMember(targetId));
      patchState(store, (state) => ({
        items: state.items.filter((member) => member.id !== targetId),
      }));
    },
  })),
);
