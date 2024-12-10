"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import type { Todo, TodoStatus } from "@/types/todo";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });

  const utils = trpc.useContext();
  const todos = trpc.todo.getAllTodos.useQuery();
  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.getAllTodos.invalidate();
      setNewTodo({ title: "", description: "" });
    },
  });
  const updateTodoStatus = trpc.todo.updateStatus.useMutation({
    onSuccess: () => utils.todo.getAllTodos.invalidate(),
  });
  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: () => utils.todo.getAllTodos.invalidate(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title) return;
    createTodo.mutate({
      title: newTodo.title,
      description: newTodo.description,
      status: "Pending" as TodoStatus,
    });
  };

  const todoStatuses: TodoStatus[] = ["Pending", "InProgress", "Completed"];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Todo title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Todo
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todos.data?.items?.map((todo: Todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p>ID: {todo.id}</p>
              <h3 className="font-semibold">{todo.title}</h3>
              {todo.description && (
                <p className="text-gray-600">{todo.description}</p>
              )}
              <span
                className={`text-sm ${
                  todo.status === "Completed"
                    ? "text-green-500"
                    : todo.status === "InProgress"
                    ? "text-yellow-500"
                    : "text-gray-500"
                }`}
              >
                {todo.status}
              </span>
            </div>
            <div className="flex gap-2">
              <select
                value={todo.status}
                onChange={(e) =>
                  updateTodoStatus.mutate({
                    id: todo.id,
                    status: e.target.value as TodoStatus,
                  })
                }
                className="p-2 border rounded"
              >
                {todoStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={() => deleteTodo.mutate(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
