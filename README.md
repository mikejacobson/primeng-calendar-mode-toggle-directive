# primeng-calendar-mode-toggle-directive
### Angular 11 Directive that adds Selection Mode toggle to [PrimeNG Calendar component](https://www.primefaces.org/primeng/showcase/#/calendar)

<br>
Working StackBlitz:

https://stackblitz.com/edit/primeng-calendar-demo-with-selectionmode-toggle-directive?file=src%2Fapp%2Fcalendar-mode-toggle.directive.ts

<br>

It just toggles between 'range' mode and 'single' mode but feel free to take the code and enhance it however you want.

<br>

Here's what the calendar looks like. I put the toggle button in the middle of the button bar because it seemed like a convenient place for it.

#### Single-select Mode

![Calendar in Single-select Mode](/images/mode-single.png?raw=true)

#### Range-select Mode

![Calendar in Range-select Mode](/images/mode-range.png?raw=true)

<br>

And here's what the Directive looks like applied to the `p-calendar` component:

```html
<p-calendar 
    [(ngModel)]="rangeDates"
    selectionMode="single"
    calendarModeToggle <-------- boom
    [showButtonBar]="true"
    calendarModeToggle
    [readonlyInput]="true"
    inputId="range">
</p-calendar>
```
