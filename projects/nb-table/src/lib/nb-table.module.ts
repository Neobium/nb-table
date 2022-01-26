import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NbTableDirectivesModule } from './nb-table-directives/nb-table-directives.module';
import { NbTableComponent } from './nb-table.component';

@NgModule({
  declarations: [
    NbTableComponent,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    NbTableDirectivesModule
  ],
  exports: [
    NbTableComponent,
    NbTableDirectivesModule
  ]
})
export class NbTableModule { }
