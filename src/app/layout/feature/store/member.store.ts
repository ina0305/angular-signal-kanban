import { signalStore, withState, withMethods, patchState, withHooks, withComputed } from '@ngrx/signals';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
        id: "mem_001",
        name: "Olivia Ryhe",
        email: "olivia@company.com",
        role: "Admin"
    },
    {
        id: "mem_002",
        name: "Alex Miller",
        email: "alex.m@company.com",
        role: "Editor"
    },
    {
        id: "mem_003",
        name: "Sarah Connor",
        email: "sarah.c@company.com",
        role: "Viewer"
    },
    {
        id: "mem_004",
        name: "Tom Hardy",
        email: "tom.h@company.com",
        role: "Viewer"
    }
];

// 定義 Store 的資料結構
export const MemberStore = signalStore(
    { providedIn: 'root' },
    withState({
        items: members, breadcrumbs: [] as MenuItem[], adminInfo: {
            name: '系統管理員',
            email: 'admin@example.com',
            dept: '研發部',
            lastLogin: '2026-11-02 11:47 (Taipei)'
        }
    }),
    withHooks({
        onInit(store) {
            // 透過 inject 拿到 Angular 路由工具
            const router = inject(Router);
            const activatedRoute = inject(ActivatedRoute);

            // 啟動背景監聽：只要網址改變 (NavigationEnd)，就去扒出路由 data 裡面的麵包屑
            router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed() // 自動解綁，防止記憶體洩漏
            ).subscribe(() => {

                // 遞迴尋找當前最深層、真正被啟用的子路由節點
                let route = activatedRoute.root;
                while (route.firstChild) {
                    route = route.firstChild;
                }

                // 從該路由節點的 snapshot.data 裡面安全拿到我們寫在 app.routes.ts 的 breadcrumb
                const breadcrumbData = route.snapshot.data['breadcrumb'] as MenuItem[] || [];

                // 💡 自動同步：直接 patchState 更新全域麵包屑資料，畫面立刻連動！
                patchState(store, { breadcrumbs: breadcrumbData });
            });
        }
    }),
    // withComputed((store,) => {
    //     totalMembers: store.items.length
    // }),
    withMethods((store, http = inject(HttpClient)) => ({
        addMember(newMember: Omit<Member, 'id'>) {
            const memberWithId: Member = {
                ...newMember,
                id: `mem_${Date.now()}`
            };
            patchState(store, (state) => ({
                items: [...state.items, memberWithId]
            }));
        },

        deleteMember(targetId: string) {
            patchState(store, (state) => ({
                items: state.items.filter((member) => member.id !== targetId)
            }))
        },

        setBreadcrumbs(paths: MenuItem[]) {
            patchState(store, { breadcrumbs: paths });
        }
    }))
);
