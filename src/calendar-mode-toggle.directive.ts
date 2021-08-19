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

    this.calendar.onTodayClick.subscribe(() => {
      this.handleTodayClick();
    });
  }

  ngOnDestroy() {
    this.disconnectAllClickListeners();
    this.deselectAllButtons();
  }

  handleTodayClick() {
    if (this.calendar.selectionMode === 'single') {
      return;
    }

    this.calendar.value = this.calendar.value[0];

    setTimeout(() => {
      this.setMode('single', this.buttons[0]);
      this.calendar.writeValue(this.calendar.value);
      this.calendar.hideOverlay();
    });
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
        this.rn.listen(btnDate, 'click', () => this.setMode('single', btnDate, true)),
        this.rn.listen(btnRange, 'click', () => this.setMode('range', btnRange, true))
      ];
    }

    const buttonBar = this.el.nativeElement.querySelector('.p-datepicker-buttonbar');
    const lastButton = buttonBar.children[1];

    this.rn.insertBefore(buttonBar, this.toggleWrapper, lastButton);
  }

  setMode(newMode: string, clickedButton: HTMLButtonElement, clearSelection = false) {
    this.mode = newMode;
    this.calendar.selectionMode = this.mode;

    this.deselectAllButtons();
    this.rn.addClass(clickedButton, selectedClass);

    if (clearSelection) {
      this.clearDateSelection();
    }
  }

  clearDateSelection() {
    const selectedMonth = this.calendar.currentMonth;
    const selectedYear = this.calendar.currentYear;

    this.calendar.writeValue(null);

    let didRestoreSelection = false;

    if (this.calendar.currentMonth !== selectedMonth) {
      this.calendar.currentMonth = selectedMonth;
      didRestoreSelection = true;
    }

    if (this.calendar.currentYear !== selectedYear) {
      this.calendar.currentYear = selectedYear;
      didRestoreSelection = true;
    }

    if (didRestoreSelection) {
      this.calendar.createMonths(this.calendar.currentMonth, this.calendar.currentYear);
    }
  }
}
