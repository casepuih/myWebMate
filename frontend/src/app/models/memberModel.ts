export interface Member {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
}

export interface ResMember {
  result: Member;
  status: number;
}

export interface MembersArray {
  groups: Member[];
}

export interface Members {
  results: MembersArray;
  status: number;
}
