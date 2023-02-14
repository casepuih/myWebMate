export interface Board {
    id: number;
    title: string;
}

export interface BoardsArray {
    boards: Board[];
}

export interface Boards {
    result: BoardsArray;
    status: number;
}
