import { TodoStatus } from "@/types/todo";
import { useCallback } from "react";
import debounce from "lodash/debounce";

interface TodoFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TodoStatus | "") => void;
  onSortChange: (field: string, order: "asc" | "desc") => void;
  onPageSizeChange: (pageSize: number) => void;
  selectedStatus: TodoStatus | "";
  sortBy: string;
  sortOrder: "asc" | "desc";
  pageSize: number;
}

export function TodoFilters({
  onSearchChange,
  onStatusChange,
  onSortChange,
  onPageSizeChange,
  selectedStatus,
  sortBy,
  sortOrder,
  pageSize,
}: TodoFiltersProps) {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 300),
    [onSearchChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const todoStatuses: TodoStatus[] = ["Pending", "InProgress", "Completed"];
  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
  ];

  const pageSizeOptions = [5, 10, 25, 50];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search todos..."
            onChange={handleSearchChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as TodoStatus | "")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            {todoStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, sortOrder)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[100px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) =>
              onSortChange(sortBy, e.target.value as "asc" | "desc")
            }
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="min-w-[100px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Per Page
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
