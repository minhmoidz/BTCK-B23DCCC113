// types.ts
export interface School {
    id: string;
    name: string;
<<<<<<< HEAD
=======
    adminEmail?: string;
    adminPassword?: string;
    adminName?: string;
    adminPhone?: string;
>>>>>>> temp-remote/main
  }
  
  export interface Major {
    id: string;
    name: string;
    schoolId: string;
  }
  
  export interface SubjectGroup {
    id: string;
    name: string;
    schoolId: string;
    majorId: string;
  }
  