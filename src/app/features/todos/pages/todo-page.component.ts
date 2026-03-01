import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TodoFilter, TodoPriority } from '../../../core/models/todo.model';
import { TodoStoreService } from '../../../core/services/todo-store.service';
import { TodoItemComponent } from '../components/todo-item.component';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-todo-page',
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    TodoItemComponent,
    AutofocusDirective,
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly store = inject(TodoStoreService);
  readonly priorities: TodoPriority[] = ['low', 'medium', 'high'];

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(160)]],
    priority: ['medium' as TodoPriority, Validators.required],
    dueDate: [''],
    tags: [''],
  });

  private readonly filterFromRoute = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const filter = params.get('filter');
        return filter === 'active' || filter === 'completed' ? filter : 'all';
      }),
    ),
    { initialValue: 'all' as TodoFilter },
  );

  readonly selectedFilter = computed(() => this.filterFromRoute());

  readonly filteredItems = computed(() => {
    const selectedFilter = this.selectedFilter();
    const items = this.store.items();

    if (selectedFilter === 'active') {
      return items.filter((item) => !item.completed);
    }

    if (selectedFilter === 'completed') {
      return items.filter((item) => item.completed);
    }

    return items;
  });

  setFilter(filter: TodoFilter): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: filter === 'all' ? null : filter },
      queryParamsHandling: 'merge',
    });
  }

  submitTodo(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store.addTodo({
      title: value.title.trim(),
      description: value.description.trim(),
      priority: value.priority,
      dueDate: value.dueDate || null,
      tags: value.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    });

    this.form.reset({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: '',
    });
  }

  trackByTodoId(index: number, item: { id: string }): string {
    return item.id;
  }
}
