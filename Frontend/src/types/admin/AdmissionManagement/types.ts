// src/pages/Admin/AdmissionManagement/types.ts

export interface School {
    id: string;
    name: string;
  }
  
  export interface Major {
    id: string;
    name: string;
  }
  
  export interface AdmissionQuota {
    schoolId: string;
    majorId: string;
    academicYear: number;
    totalQuota: number;
    quotaByMethod: {
      thpt: number;
      hsa: number;
      tsa: number;
      dgnl: number;
      xthb: number;
    };
  }
  
  export interface AdmissionResult {
    method: string;
    quota: number;
    totalProfiles: number;
    selectedProfiles: Array<{
      profileId: string;
      maHoSo: string;
      hoTen: string;
      score: number;
    }>;
    error?: string;
  }
  
  export interface AdmissionSummary {
    totalProcessed: number;
    totalAccepted: number;
    notificationsSent: number;
  }
  