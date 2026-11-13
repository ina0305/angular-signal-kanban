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

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

const members: Member[] = [
  {
    id: 'mem_001',
    name: 'Olivia Ryhe',
    email: 'olivia@company.com',
    role: 'member.role.admin',
  },
  {
    id: 'mem_002',
    name: 'Alex Miller',
    email: 'alex.m@company.com',
    role: 'member.role.editor',
  },
  {
    id: 'mem_003',
    name: 'Sarah Connor',
    email: 'sarah.c@company.com',
    role: 'member.role.viewer',
  },
  {
    id: 'mem_004',
    name: 'Tom Hardy',
    email: 'tom.h@company.com',
    role: 'member.role.viewer',
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
    addMember(newMember: Omit<Member, 'id'>) {
      const memberWithId: Member = {
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
