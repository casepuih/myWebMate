export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface NotesArray {
  notes: Note[];
}

export interface Notes {
  result: NotesArray;
  status: number;
}
