export type RequestStatus = 'OPEN' | 'APPROVED' | 'DECLINED';

export interface Request {
  id: string;
  title: string;
  link: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
}
