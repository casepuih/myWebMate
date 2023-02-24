export interface Commentaries {
    id: number;
    commentary: string;
}

export interface CommentariesArray {
    commentaries: Commentaries[];
}

export interface Commentaries {
    result: CommentariesArray;
    status: number;
}
