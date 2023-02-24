export interface Project {
    id: number;
    title: string;
    description: string;
    dateBegin: Date;
    dateEnding: Date;
    boardId: number;
}

export interface ProjectsArray {
    projects: Project[];
}

export interface Projects {
    result: ProjectsArray;
    status: number;
}
