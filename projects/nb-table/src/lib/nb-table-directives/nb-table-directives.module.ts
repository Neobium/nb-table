import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbHeaderRowDirective,
  NbRowDirective,
  NbTableDirective,
} from './directives/nb-table.directive';

@NgModule({
  declarations: [
    NbTableDirective,
    NbColumnHeaderDirective,
    NbColumnCellDirective,
    NbHeaderRowDirective,
    NbRowDirective,
  ],
  imports: [CommonModule, DragDropModule],
  exports: [
    NbTableDirective,
    NbColumnHeaderDirective,
    NbColumnCellDirective,
    NbHeaderRowDirective,
    NbRowDirective,
  ],
})
export class NbTableDirectivesModule { }
