export interface GroupMember {
    id: number;
    isAdmin: string;
    tier: string;
    group_id: number;
    member_id: number;
}

export interface GroupsMembersArray {
    groupsMembers: GroupMember[];
}

export interface GroupsMembers {
    results: GroupsMembersArray;
    status: number;
}
