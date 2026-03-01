export type TodoPriority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  tags: string[];
}

export type TodoFilter = 'all' | 'active' | 'completed';
