// import { isEqual } from 'lodash-es';

import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';


const isNil = (value: any) => {
  return value === null || value === undefined;
};

const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

@Directive({ selector: 'p-slider[value][ngModel]', providers: [NgModel] })
export class RangeSliderDirective implements AfterViewInit, OnChanges {
  private nodes: HTMLElement[] | undefined;

  @Input() max: number = 1000;
  @Input() value: number[] = [];

  private readValue: number[] = [];

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private context: NgModel
  ) {}

  ngAfterViewInit(): void {
    this.nodes = this.element.nativeElement.querySelectorAll('.p-slider-handle');
    this.bind(this.nodes, this.context.model ?? []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['max'] || !isEqual(this.value, this.readValue)) {
      if (this.nodes && this.nodes.length) {
        this.bind(this.nodes, this.context.model ?? []);
      }
    }
  }

  @HostListener('ngModelChange', ['$event'])
  onChange(event: number[]) {
    this.bind(this.nodes, event);
  }

  private bind(nodes: HTMLElement[] | undefined, values: number[]) {
    let spaceForLeft = 0;
    const left = nodes && nodes.length > 0 ? nodes[0] : undefined;
    const right = nodes && nodes.length > 1 ? nodes[1] : undefined;
    const width: number = this.element.nativeElement?.getBoundingClientRect().width ?? 0;

    this.readValue = values;

    if (!width) {
      return;
    }

    if (left) {
      const value = !isNil(values[0]) ? values[0].toString() : '0';
      spaceForLeft = width * (parseFloat(left.style.left.replace('%', '')) / 100);

      this.renderer.setAttribute(left, 'data-left', value);

      if (spaceForLeft > 50) {
        this.renderer.addClass(left, 'to-right');
      } else {
        this.renderer.removeClass(left, 'to-right');
      }
    }

    if (right) {
      const value = !isNil(values[1]) ? values[1].toString() : `${this.max ?? right.getAttribute('aria-valuemax')}` || '0';
      const spaceForRight = width * ((100 - parseFloat(right.style.left.replace('%', ''))) / 100);
      const spaceLeft = width * (parseFloat(right.style.left.replace('%', '')) / 100);

      this.renderer.setAttribute(right, 'data-right', value);

      if (spaceLeft - spaceForLeft - 50 < 0 && !isNil(values[1])) {
        this.renderer.addClass(right, 'to-bottom');
      } else {
        this.renderer.removeClass(right, 'to-bottom');
      }

      if (spaceForRight > 50 && !isNil(values[1])) {
        this.renderer.addClass(right, 'to-left');
      } else {
        this.renderer.removeClass(right, 'to-left');
      }
    }
  }
}
