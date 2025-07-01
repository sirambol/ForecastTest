export interface Task {
  id: number;
  title: string;
  done: boolean;
  urgency: number;
}

export type TaskInput = {
  title: string;
  urgency: number;
};