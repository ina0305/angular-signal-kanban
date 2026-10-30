import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

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
    withState({ items: members, breadcrumbs: [] as MenuItem[] }),
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
