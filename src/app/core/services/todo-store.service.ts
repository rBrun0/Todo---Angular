import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TodoItem, TodoPriority } from '../models/todo.model';

const STORAGE_KEY = 'angular.todo-academy.items';

@Injectable({
  providedIn: 'root',
})
export class TodoStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);

  private readonly itemsSignal = signal<TodoItem[]>([]);

  readonly items = computed(() => this.itemsSignal());
  readonly total = computed(() => this.items().length);
  readonly completed = computed(
    () => this.items().filter((item) => item.completed).length,
  );
  readonly active = computed(() => this.total() - this.completed());

  constructor() {
    this.restoreFromStorage();

    effect(() => {
      if (!this.browser) {
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    });
  }

  addTodo(payload: {
    title: string;
    description: string;
    priority: TodoPriority;
    dueDate: string | null;
    tags: string[];
  }): void {
    const newTodo: TodoItem = {
      id: this.createId(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      completed: false,
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString(),
      tags: payload.tags,
    };

    this.itemsSignal.update((current) => [newTodo, ...current]);
  }

  toggleTodo(id: string): void {
    this.itemsSignal.update((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  removeTodo(id: string): void {
    this.itemsSignal.update((current) =>
      current.filter((item) => item.id !== id),
    );
  }

  clearCompleted(): void {
    this.itemsSignal.update((current) =>
      current.filter((item) => !item.completed),
    );
  }

  private restoreFromStorage(): void {
    if (!this.browser) {
      return;
    }

    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) {
      return;
    }

    try {
      const parsed = JSON.parse(cached) as TodoItem[];
      if (Array.isArray(parsed)) {
        this.itemsSignal.set(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
