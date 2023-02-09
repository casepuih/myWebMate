export interface Task {
  id: number;
  title: string;
  description: string;
  dateBegin: Date;
  isRecurring: boolean;
  recurrence: string;
}

export interface Tasks {
  tasks: Task[];
}

export interface ResAllTask {
  result: Tasks;
  status: number;
}

export interface Meet {
  id: number;
  title: string;
  description: string;
  dateBegin: Date;
  dateEnding: Date;
  isRecurring: boolean;
  recurrence: string;
}

export interface Meets {
  meets: Meet[];
}

export interface ResAllMeet {
  result: Meets;
  status: number;
}
