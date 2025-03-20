import { MultiSelect } from 'primeng/multiselect';
import { ObjectUtils } from 'primeng/utils';
import { fromEvent, Subject, takeWhile } from 'rxjs';

import { DOCUMENT, isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'block',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused || overlayVisible',
  },
})
export class MultiselectComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() styleClass = 'multiselect-style';
  @Input() iconClass = 'icon icon--arrow_down';
  @Input() placeholder: string | undefined;
  @Input() translateDictionaries = true;
  @Input() set options(value: any[] | null) {
    this.dictionaries = value ?? [];

    this.isEmptyOptions = value === null || value === undefined;
  }

  get options(): any[] {
    return this.dictionaries;
  }

  @Input() appendTo: string | null = 'body';
  @Input() showClear = false;
  @Input() showHeader = true;
  @Input() showToggleAll = false;
  @Input() inputId: string | undefined;
  @Input() virtualScroll = false;
  @Input() maxSelectedLabels = 3;
  @Input() outputObject = false;

  @Input() optionObject = false;
  @Input() optionValue = 'id';
  @Input() optionLabel = 'value';
  @Input() optionDisabled = '';

  @ViewChild(MultiSelect) multiselect: MultiSelect | undefined;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();
  @Output() writeChange = new EventEmitter<any>();

  value: any[] = [];

  focused = false;
  filled = false;
  disabled = false;
  overlayVisible = false;
  selectedOptions: any[] = [];

  private isEmptyOptions = true;
  private dictionaries: any[] = [];
  private defaultValue: any[] | null = null;
  private stateChanges = new Subject<void>();
  private destroy$ = new Subject<void>();
  private ngChange = (value: any) => {};
  private ngTouched = () => {};

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.stateChanges.subscribe(() => this.cdr.markForCheck());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      const hasPreviousValue = Array.isArray(changes['options'].previousValue) && !!changes['options'].previousValue.length;
      const hasCurrentValue = Array.isArray(changes['options'].currentValue) && !!changes['options'].currentValue.length;

      if (!hasPreviousValue && hasCurrentValue) {
        this.onChangeOptions();
      }

      if (!this.isEmptyOptions) {
        this.onModelChange(this.value);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stateChanges.complete();
  }

  onChangeValue(event: { value: any[] }): void {
    this.filled = event.value !== null && event.value !== undefined;

    this.selectedOptions = this.getSelectedOptions(event.value);

    this.ngChange(this.optionObject ? this.selectedOptions : event.value);

    this.onChange.emit(this.outputObject ? this.selectedOptions : event);
  }

  onClearValue() {
    this.onClear.emit();
  }

  onModelChange(modelValue: any[]): void {
    if (modelValue === null || (Array.isArray(modelValue) && !modelValue.length)) {
      return;
    }

    this.selectedOptions = this.getSelectedOptions(modelValue);
    const value = this.selectedOptions.map((value: any) => this.resolveFieldData(value, this.optionValue));

    if (this.defaultValue === null) {
      this.value = value;

      this.ngChange(this.optionObject ? this.selectedOptions : value);
      this.onChange.emit(this.outputObject ? this.selectedOptions : event);
    }
  }

  onBlur(): void {
    this.focused = false;
    this.ngTouched();
  }

  onFocus(): void {
    this.focused = true;
  }

  onShow() {
    if (this.inModal()) {
      this.closeOnScroll();
    }
  }

  resolveFieldData(object: any, key: string): any {
    return ObjectUtils.resolveFieldData(object, key);
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  show(): void {
    this.multiselect?.show();
    this.multiselect?.cd?.markForCheck();
  }

  writeValue(writeValue: any): void {
    let value = writeValue;

    this.filled = value !== null && value !== undefined;

    if (this.optionObject && writeValue) {
      let finalArray = writeValue.map((value: any) => this.resolveFieldData(value, this.optionValue));
      value = finalArray;
    }

    this.value = value;
    this.defaultValue = value;

    if (value) {
      this.selectedOptions = this.getSelectedOptions(value);
    } else {
      this.selectedOptions = [];
    }

    this.writeChange.emit(this.outputObject ? this.selectedOptions : value);

    this.stateChanges.next();
  }

  registerOnChange(fn: any): void {
    this.ngChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.ngTouched = fn;
  }

  inModal(): boolean {
    return Array.from(this.document.querySelectorAll('app-filtersbar, app-modal')).some(el =>
      el.contains(this.multiselect?.el.nativeElement)
    );
  }

  private onChangeOptions(): void {
    if (Array.isArray(this.defaultValue) && this.defaultValue.length) {
      setTimeout(() => {
        if (!this.defaultValue) {
          return;
        }

        this.value = this.defaultValue;

        const selected = this.defaultValue.map(value =>
          typeof value === 'object' && !Array.isArray(value) ? this.resolveFieldData(value, this.optionValue) : value
        );
        this.selectedOptions = this.getSelectedOptions(selected);

        this.writeChange.emit(this.outputObject ? this.selectedOptions : this.value);

        this.defaultValue = null;

        this.stateChanges.next();
      });
    }
  }

  private closeOnScroll() {
    fromEvent(window, 'scroll')
      .pipe(takeWhile(() => !!this.multiselect?.overlayVisible))
      .subscribe(() => {
        if (this.multiselect?.overlayVisible) {
          this.multiselect.hide();
        }
      });
  }

  private getSelectedOptions(selected: any[]): any[] {
    return (
      this.options?.filter((value: any) => {
        const optionValue = this.resolveFieldData(value, this.optionValue);

        if (Array.isArray(selected) && Array.isArray(optionValue)) {
          return selected.some((selectedValues: any) => {
            if (Array.isArray(selectedValues)) {
              return optionValue.every((val: any) => selectedValues.includes(val));
            }

            return false;
          });
        }

        return selected.includes(this.resolveFieldData(value, this.optionValue));
      }) ?? []
    );
  }
}
