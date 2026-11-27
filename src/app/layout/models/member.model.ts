export type MemberStatus = 'active' | 'inactive' | 'pending';

// 從 API 或資料庫讀取的完整會員資料。
export interface MemberInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: string;
  birth?: string;
  role: string;
  status: MemberStatus;
  createTime: string;
  language?: string;
  timeZone?: string;
  note?: string;
}

// 新增時由 server 產生 id 與 createTime，所以 request 不需要傳這兩欄。
export type MemberCreateInput = Omit<MemberInfo, 'id' | 'createTime'>;
