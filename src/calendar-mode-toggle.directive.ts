import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Calendar } from 'primeng/calendar';

const selectedClass = 'selected';

@Directive({
  selector: '[calendarModeToggle]'
})
export class CalendarModeToggleDirective implements OnInit, OnDestroy {
  @Input('calendarModeToggle') toggleWrapper: HTMLDivElement;

  stopListening;
  buttons;

  constructor(
    private el: ElementRef,
    private calendar: Calendar,
    private rn: Renderer2
  ) { }

  ngOnInit() {
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
    this.calendar.hideOverlay();

    setTimeout(() => {
      this.setMode('single', this.buttons[0]);
      this.calendar.writeValue(this.calendar.value);
    }, 50);
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
        this.rn.listen(btnDate, 'click', () => this.setMode('single', btnDate, { clearSelection: true })),
        this.rn.listen(btnRange, 'click', () => this.setMode('range', btnRange, { clearSelection: true }))
      ];
    }

    const buttonBar = this.el.nativeElement.querySelector('.p-datepicker-buttonbar');
    const lastButton = buttonBar.children[1];

    this.rn.insertBefore(buttonBar, this.toggleWrapper, lastButton);
  }

  setMode(selectedMode: string, clickedButton: HTMLButtonElement, { clearSelection = false } = {}) {
    if (this.calendar.selectionMode === selectedMode) {
      return;
    }

    this.calendar.selectionMode = selectedMode;

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
      // prevent jump to current month when clearing selection
      this.calendar.createMonths(this.calendar.currentMonth, this.calendar.currentYear);
    }
  }
}
