export interface Task {
  id: number;
  title: string;
  description: string;
  dateBegin: Date;
  isRecurring: boolean;
  recurrence: string;
  MemberId?:number[];
}

export interface Tasks {
  tasks: Task[];
}

export interface ResAllTask {
  result: Tasks;
  status: number;
}

export interface ResultOneTask {
  task: Task[];
}

export interface ResOneTask {
  result: ResultOneTask;
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
  MemberId?:number[];
}

export interface Meets {
  meets: Meet[];
}

export interface ResAllMeet {
  result: Meets;
  status: number;
}

export interface ResultOneMeet {
  meet: Meet[];
}

export interface ResOneMeet {
  result: ResultOneMeet;
  status: number;
}
