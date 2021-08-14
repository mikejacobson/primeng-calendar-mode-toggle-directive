import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Calendar } from 'primeng/calendar';

const defaultSelectionMode = 'single';
const primeNgButtonClasses = 'p-button-text p-ripple p-button p-component';
const buttonTextSingle = `Selection Mode Single
Change to Range
`;
const buttonTextRange  = `Selection Mode Range
Change to Single
`;

@Directive({
  selector: '[calendarModeToggle]'
})
export class CalendarModeToggleDirective implements OnInit, OnDestroy {
  mode: string;
  toggleButton: HTMLButtonElement;
  stopListening;

  constructor(
    private el: ElementRef,
    private calendar: Calendar,
    private rn: Renderer2
  ) { }

  ngOnInit() {
    this.mode = this.calendar.selectionMode || defaultSelectionMode;

    this.calendar.onShow.subscribe(() => {
      this.addToggleButtonToButtonBar();
    });

    this.calendar.onClose.subscribe(() => {
      this.stopListening();
      this.stopListening = null;
      this.toggleButton = null;
    });
  }

  ngOnDestroy() {
    if (this.stopListening) {
      this.stopListening();
    }
  }

  toggleMode() {
    this.mode = this.mode === 'range' ? 'single' : 'range';
    this.calendar.selectionMode = this.mode;
    this.calendar.writeValue(null);
    this.setButtonLabel();
  }

  addToggleButtonToButtonBar() {
    const buttonBar = this.el.nativeElement.querySelector('.p-datepicker-buttonbar');
    const lastButton = buttonBar.children[1];
    const toggleButton = this.rn.createElement('button');

    this.rn.setAttribute(toggleButton, 'class', primeNgButtonClasses);
    this.rn.setAttribute(toggleButton, 'style', 'font-size: smaller');

    this.stopListening = this.rn.listen(toggleButton, 'click', () => this.toggleMode());
    this.rn.insertBefore(buttonBar, toggleButton, lastButton);

    this.toggleButton = toggleButton;
    this.setButtonLabel();
  }

  setButtonLabel() {
    this.toggleButton.innerText = this.mode === 'single' ? buttonTextSingle : buttonTextRange;
  }
}
