export interface Notification {
  _id: string;
  title: string;
  content: string;
<<<<<<< HEAD
  description: string;
  image?: string;
  isImportant: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
=======
  type: 'normal' | 'urgent' | 'announcement';
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  isPinned: boolean;
  scheduledFor?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  visibility: 'all_users' | 'roles';
  targetRoles?: Array<'student' | 'parent' | 'school'>;
>>>>>>> temp-remote/main
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
<<<<<<< HEAD
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
=======
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  nextPage: number | null;
  hasPrevPage: boolean;
  prevPage: number | null;
  pagingCounter: number;
>>>>>>> temp-remote/main
} 