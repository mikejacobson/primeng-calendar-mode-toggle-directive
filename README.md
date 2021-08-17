# primeng-calendar-mode-toggle-directive
### Angular Directive that adds Selection Mode toggle to [PrimeNG Calendar component](https://www.primefaces.org/primeng/showcase/#/calendar)

<br>
Working StackBlitz:

https://stackblitz.com/edit/primeng-calendar-demo-with-selectionmode-toggle-directiv-ytrnb6?file=src%2Fapp%2Fcalendar-mode-toggle.directive.ts

<br>

It just toggles between 'range' mode and 'single' mode but feel free to take the code and enhance it however you want. (The component also supports a 'multiple' mode but I didn't need to support that.)

<br>

Here's what the calendar looks like. I put the toggle buttons in the middle of the button bar because it seemed like a convenient place for it.

#### Single-select Mode

![Calendar in Single-select Mode](/images/mode-date.png?raw=true)

#### Range-select Mode

![Calendar in Range-select Mode](/images/mode-date-range.png?raw=true)

<br>

And here's what the Directive looks like applied to the `p-calendar` component. Note that the directive takes as an input a template reference variable for the container element housing the buttons.

```html
<p-calendar 
  [(ngModel)]="rangeDates"
  selectionMode="single"
  [calendarModeToggle]="modeToggle"  <----- boom
  [showButtonBar]="true"
  calendarModeToggle
  [readonlyInput]="true"
  inputId="range">
</p-calendar>
<template>
  <div #modeToggle class="toggle-wrapper">
    <style>
      .toggle-wrapper {
        display: flex;
        align-items: center;
      }

      .toggle-wrapper button {
        letter-spacing: 0.235px;
        padding: 8px;
      }

      .toggle-wrapper button.selected {
        font-weight: 700;
        letter-spacing: 0;
      }

      .toggle-wrapper span {
        font-size: 1.25em;
        opacity: 0.7;
        padding: 0;
      }
    </style>
    <button class="p-button-text p-ripple p-button p-component">Date</button>
    <span class="p-button p-button-text">|</span>
    <button class="p-button-text p-ripple p-button p-component">Date Range</button>
  </div>
</template>
```
