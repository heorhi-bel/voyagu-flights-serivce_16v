import { Subject } from 'rxjs';

import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'range-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class RangeSliderComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() min: number = 0;
  @Input() max: number = 1000;
  @Input() step: number = 1;

  @Output() onChange = new EventEmitter<any>();

  value: number[] = [];
  focused = false;
  filled = false;
  disabled = false;

  private stateChanges = new Subject<void>();
  private destroy$ = new Subject<void>();
  private ngChange = (value: any) => {};
  private ngTouched = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.stateChanges.subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stateChanges.complete();
  }

  onChangeValue(event: any): void {
    this.filled = event.values !== null && event.values !== undefined;

    this.onChange.emit(this.value);
    this.ngChange(this.value);
  }

  onBlur(): void {
    this.focused = false;
    this.ngTouched();
  }

  onFocus(): void {
    this.focused = true;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.stateChanges.next();
  }

  writeValue(writeValue: any): void {
    let value = writeValue;

    this.filled = value !== null && value !== undefined;

    this.value = value;

    this.stateChanges.next();
  }

  registerOnChange(fn: any): void {
    this.ngChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.ngTouched = fn;
  }
}
