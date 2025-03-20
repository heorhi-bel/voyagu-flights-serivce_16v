import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    CardModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ListboxModule,
    RadioButtonModule,
    SliderModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    CardModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ListboxModule,
    RadioButtonModule,
    SliderModule,
    ButtonModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule
  ],
  providers: []
})
export class SharedLibraryModule {}
