import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-learn-page',
  templateUrl: './learn-page.component.html',
  styleUrl: './learn-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnPageComponent {
  readonly concepts: string[] = [
    'Componentes standalone e rotas lazy',
    'Formulários reativos com validadores',
    'Signals, valores computados e efeitos',
    'Injeção de dependência com um serviço com estado',
    'Pipe customizado e diretiva customizada',
    'Sintaxe de controle de fluxo (@if, @for)',
    'Vinculação de eventos e Input/Output entre componentes',
    'Persistência no localStorage segura para SSR',
  ];
}
