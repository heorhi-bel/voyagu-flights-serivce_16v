import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RangeSliderComponent } from './slider.component';
import { RangeSliderDirective } from './slider.directive';
import { SliderModule } from 'primeng/slider';

@NgModule({
  imports: [CommonModule, FormsModule, SliderModule],
  exports: [RangeSliderComponent],
  declarations: [RangeSliderComponent, RangeSliderDirective],
})
export class RangeSliderModule {}
