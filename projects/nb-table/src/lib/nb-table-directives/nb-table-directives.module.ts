import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCellDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbHeaderCellDirective,
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
    NbHeaderCellDirective,
    NbCellDirective
  ],
  imports: [CommonModule, DragDropModule],
  exports: [
    NbTableDirective,
    NbColumnHeaderDirective,
    NbColumnCellDirective,
    NbHeaderRowDirective,
    NbRowDirective,
    NbHeaderCellDirective,
    NbCellDirective
  ],
})
export class NbTableDirectivesModule { }
