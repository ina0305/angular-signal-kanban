import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
  withComputed,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// PrimeNg
import { MenuItem } from 'primeng/api';

// Route
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Rxjs
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberInfo } from '../../models/member.model';

const members: MemberInfo[] = [
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

// 定義 Store 的資料結構
export const MemberStore = signalStore(
  { providedIn: 'root' },
  withState({
    items: members,
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
    },
  }),
  withMethods((store, http = inject(HttpClient)) => ({
    createMember(newMember: Omit<MemberInfo, 'id'>) {
      const memberWithId: MemberInfo = {
        ...newMember,
        id: `mem_${Date.now()}`,
      };
      patchState(store, (state) => ({
        items: [...state.items, memberWithId],
      }));
    },

    deleteMember(targetId: string) {
      patchState(store, (state) => ({
        items: state.items.filter((member) => member.id !== targetId),
      }));
    },

    setBreadcrumbs(paths: MenuItem[]) {
      patchState(store, { breadcrumbs: paths });
    },
  })),
);
