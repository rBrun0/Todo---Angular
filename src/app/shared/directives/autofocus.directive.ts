import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements OnInit {
  private readonly elementRef = inject(
    ElementRef<HTMLInputElement | HTMLTextAreaElement>,
  );
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    queueMicrotask(() => this.elementRef.nativeElement.focus());
  }
}
