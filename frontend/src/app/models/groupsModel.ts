export interface Group {
    id: number;
    name: string;
    description?: string;
}

export interface GroupsArray {
    groups: Group[];
}

export interface Groups {
    results: GroupsArray;
    status: number;
}
