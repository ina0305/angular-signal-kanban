type Status = 'active' | 'inactive' | 'pending';

export interface MemberInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: string;
  birth?: string;
  role: string;
  status: Status;
  createTime: string;
  language?: string;
  timeZone?: string;
  note?: string;
}
