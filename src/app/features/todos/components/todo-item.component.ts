import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TodoItem } from '../../../core/models/todo.model';
import { PriorityLabelPipe } from '../../../shared/pipes/priority-label.pipe';

@Component({
  selector: 'app-todo-item',
  imports: [DatePipe, PriorityLabelPipe],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  readonly todo = input.required<TodoItem>();
  readonly toggle = output<string>();
  readonly remove = output<string>();

  onToggle(): void {
    this.toggle.emit(this.todo().id);
  }

  onRemove(): void {
    this.remove.emit(this.todo().id);
  }
}
