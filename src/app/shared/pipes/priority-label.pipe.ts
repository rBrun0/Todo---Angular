import { Pipe, PipeTransform } from '@angular/core';
import { TodoPriority } from '../../core/models/todo.model';

@Pipe({
  name: 'priorityLabel',
  standalone: true,
})
export class PriorityLabelPipe implements PipeTransform {
  transform(priority: TodoPriority): string {
    switch (priority) {
      case 'high':
        return 'Prioridade alta';
      case 'medium':
        return 'Prioridade média';
      default:
        return 'Prioridade baixa';
    }
  }
}
