import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedLibraryModule } from './shared-library.module';
import { SharedCommonsModule } from './commons/shared-commons.module';


@NgModule({
  imports: [SharedLibraryModule, SharedCommonsModule, CommonModule],
  exports: [SharedLibraryModule, SharedCommonsModule],
})
export class SharedModule {}
