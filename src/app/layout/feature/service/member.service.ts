import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MemberCreateInput, MemberInfo } from '../../models/member.model';

// 集中管理會員功能對 server 發出的 HTTP 請求。
@Injectable({
  providedIn: 'root',
})
export class MemberService {
  readonly #http = inject(HttpClient);

  getMemberList() {
    return this.#http.get<MemberInfo[]>('/api/members');
  }

  createMember(member: MemberCreateInput) {
    return this.#http.post<MemberInfo>('/api/members', member);
  }

  deleteMember(id: string) {
    return this.#http.delete<void>(`/api/members/${encodeURIComponent(id)}`);
  }
}
