export interface Notification {
  _id: string;
  title: string;
  content: string;
  type: 'normal' | 'urgent' | 'announcement';
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  isPinned: boolean;
  scheduledFor?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  visibility: 'all_users' | 'roles';
  targetRoles?: Array<'student' | 'parent' | 'school'>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
  hasPrevPage: boolean;
  prevPage: number | null;
  pagingCounter: number;
} 