export type TodoStatus = "Pending" | "InProgress" | "Completed";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}
