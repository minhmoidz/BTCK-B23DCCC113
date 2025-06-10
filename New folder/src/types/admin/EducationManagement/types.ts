// types.ts
export interface School {
    id: string;
    name: string;
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
  