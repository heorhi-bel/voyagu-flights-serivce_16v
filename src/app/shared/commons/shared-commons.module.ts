import { NgModule } from "@angular/core";
import { SharedLibraryModule } from "../shared-library.module";
import { RangeSliderComponent } from "./slider/slider.component";
import { CardComponent } from "./card/card.component";
import { MultiselectComponent } from "./multiselect";

@NgModule({
    imports: [SharedLibraryModule],
    declarations: [
        RangeSliderComponent,
        MultiselectComponent,
        CardComponent,
    ],
    exports: [
        RangeSliderComponent,
        MultiselectComponent,
        CardComponent,
    ],
    providers: [],
  })
export class SharedCommonsModule {}
