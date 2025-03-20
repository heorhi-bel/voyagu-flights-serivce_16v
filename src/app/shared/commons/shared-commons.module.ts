import { NgModule } from "@angular/core";
import { SharedLibraryModule } from "../shared-library.module";
import { CardComponent } from "./card/card.component";
import { MultiselectComponent } from "./multiselect";

@NgModule({
    imports: [SharedLibraryModule],
    declarations: [
        MultiselectComponent,
        CardComponent,
    ],
    exports: [
        MultiselectComponent,
        CardComponent,
    ],
    providers: [],
  })
export class SharedCommonsModule {}
