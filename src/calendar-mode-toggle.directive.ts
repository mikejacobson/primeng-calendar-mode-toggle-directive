import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Calendar } from 'primeng/calendar';

const defaultSelectionMode = 'single';
const selectedClass = 'selected';

@Directive({
  selector: '[calendarModeToggle]'
})
export class CalendarModeToggleDirective implements OnInit, OnDestroy {
  @Input('calendarModeToggle') toggleWrapper: HTMLDivElement;

  mode: string;
  stopListening;
  buttons;

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
  }

  ngOnDestroy() {
    this.disconnectAllClickListeners();
    this.deselectAllButtons();
  }

  disconnectAllClickListeners() {
    if (this.stopListening) {
      this.stopListening.forEach(fn => fn());
    }
  }

  deselectAllButtons() {
    this.buttons.forEach((button: HTMLButtonElement) => {
      this.rn.removeClass(button, selectedClass);
    });
  }

  addToggleButtonToButtonBar() {
    if (!this.buttons) {
      this.buttons = this.toggleWrapper.querySelectorAll('button');

      const btnDate = this.buttons[0];
      const btnRange = this.buttons[1];
  
      this.rn.addClass(btnDate, selectedClass);

      this.stopListening = [
        this.rn.listen(btnDate, 'click', () => this.toggleMode('single', btnDate)),
        this.rn.listen(btnRange, 'click', () => this.toggleMode('range', btnRange))
      ];
    }

    const buttonBar = this.el.nativeElement.querySelector('.p-datepicker-buttonbar');
    const lastButton = buttonBar.children[1];

    this.rn.insertBefore(buttonBar, this.toggleWrapper, lastButton);
  }

  toggleMode(newMode: string, clickedButton: HTMLButtonElement) {
    this.mode = newMode;
    this.calendar.selectionMode = this.mode;
    this.calendar.writeValue(null);

    this.deselectAllButtons();
    this.rn.addClass(clickedButton, selectedClass);
  }
}
