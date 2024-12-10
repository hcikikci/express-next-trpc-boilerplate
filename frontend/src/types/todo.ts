export type TodoStatus = "Pending" | "InProgress" | "Completed";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}
