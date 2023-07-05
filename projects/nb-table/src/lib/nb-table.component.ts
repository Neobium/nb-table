import { CdkDragDrop, DragDrop, DragRef, DropListRef, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Signal,
  ViewChild,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DirectiveContainer } from './nb-table-directives/directive-container';
import {
  INbTableDirective,
  NbCellDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbHeaderCellDirective,
  NbHeaderRowDirective,
  NbRowDirective,
  NbTableDirective,
} from './nb-table-directives/directives/nb-table.directive';
import { NbTableService } from './nb-table.service';

@Component({
  selector: 'nb-table',
  templateUrl: './nb-table.component.html',
  styleUrls: ['./nb-table.component.scss'],
})
export class NbTableComponent implements OnInit, OnDestroy {
  @Input() set dataSource(source: Record<string, unknown>[]) {
    this._tableService.setSource(source);
  }

  @ContentChildren(NbTableDirective) set cells(_cells: QueryList<INbTableDirective>) {
    this._directiveContainer = new DirectiveContainer(_cells);
    this.headerRows = this._directiveContainer.getHeaderRowDirectives();
    this._originalColumnHeaders = this._directiveContainer.getColumnHeaderDirectives();
    this.columnHeaders = Object.assign([], this._originalColumnHeaders);
    this.tableRows = this._directiveContainer.getRowDirectives();
    this._originalTableCells = this._directiveContainer.getColumnCellDirectives();
    this.tableCells = Object.assign([], this._originalTableCells);
  }

  @ContentChildren(NbHeaderCellDirective) set dragHeaders(headers: QueryList<NbHeaderCellDirective>) {
    if (!headers.length) return;
    const dragRefs = headers.toArray().map(h => h._dragRef);
    this._dragRefs = dragRefs;

    this._dropListRef = this._dragDrop.createDropList(this._nbDragHeaderList);
    this._dropListRef.withItems(this._dragRefs);

    this._dropListRef.dropped.pipe(takeUntil(this._unsubscriber)).subscribe(a => {
      if (this.selectedHeaders.findIndex(k => k === (a.item.data.dragData || a.item.data.element.nativeElement.innerText)) < 0) {
        this.selectedHeaders.push(a.item.data.dragData || a.item.data.element.nativeElement.innerText);
        this._rearrangeColumns();
      }
    });
  }

  // @ContentChildren(NbCellDirective) set dataCells(_dataCells: QueryList<NbCellDirective>) {
  //   console.log(_dataCells);
  //   this._dataCells = _dataCells;
  // }

  @Output() selectedColumns = new EventEmitter<Array<string>>();

  @ViewChild('nbDragHeaderList') private _nbDragHeaderList: HTMLElement;

  private _directiveContainer: DirectiveContainer;
  headerRows: NbHeaderRowDirective[];
  columnHeaders: NbColumnHeaderDirective[];
  tableRows: NbRowDirective[];
  tableCells: NbColumnCellDirective[];
  private _dataCells: QueryList<NbCellDirective>;

  private _originalColumnHeaders: NbColumnHeaderDirective[];
  private _originalTableCells: NbColumnCellDirective[];

  dataSource$: Observable<Record<string, unknown>[]> = this._tableService.dataSource$;
  dataSourceSig: Signal<Record<string, unknown>[]> = this._tableService.dataSource;

  private _dropListRef: DropListRef<unknown>;
  private _dragRefs: DragRef[];

  selectedHeaders: string[] = [];

  private _unsubscriber = new Subject<void>();

  constructor(private _tableService: NbTableService, private _dragDrop: DragDrop, private _cd: ChangeDetectorRef) {
    this._tableService.stable$.pipe(takeUntil(this._unsubscriber)).subscribe((stable) => {
      if (stable) {
        this._resetOrder();
        this._rearrangeColumns();
      }
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this._rearrangeColumns();
  }

  removeHeader(index: number): void {
    this.selectedHeaders.splice(index, 1);
    this._rearrangeColumns();
  }

  private _rearrangeColumns(): void {
    this.selectedColumns.emit(this.selectedHeaders);
    this._tableService.setSelectedColumns(this.selectedHeaders);
    this._resetOrder();

    this.columnHeaders = this.columnHeaders.sort((h1, h2) => this._determineOrder(h1, h2));
    this.tableCells = this.tableCells.sort((c1, c2) => this._determineOrder(c1, c2));
  }

  private _resetOrder(): void {
    this.columnHeaders = Object.assign([], this._originalColumnHeaders);
    this.tableCells = Object.assign([], this._originalTableCells);
  }

  private _determineOrder(d1: NbColumnHeaderDirective | NbColumnCellDirective, d2: NbColumnHeaderDirective | NbColumnCellDirective): number {
    const d1Index = this.selectedHeaders.findIndex(h => h === d1.column);
    const d2Index = this.selectedHeaders.findIndex(h => h === d2.column);

    if (d1Index > -1 && d2Index === -1) return -1;
    if (d1Index === -1 && d2Index === -1) return 0;
    if (d1Index === -1 && d2Index > -1) return 1;

    if (d1Index < d2Index) return -1;
    if (d1Index > d2Index) return 1;

    return 0;
  }
}
