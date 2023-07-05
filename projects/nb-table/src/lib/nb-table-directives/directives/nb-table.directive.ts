import { CdkDrag, DragDrop } from '@angular/cdk/drag-drop';
import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  effect,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NbTableService } from '../../nb-table.service';

export interface INbTableDirective {
  template: TemplateRef<any>;
}

@Directive({
  selector: '[nbTable]',
})
export class NbTableDirective implements INbTableDirective {
  constructor(public template: TemplateRef<any>) { }
}

@Directive({
  selector: '[nbColumnHeader]',
  providers: [
    { provide: NbTableDirective, useExisting: NbColumnHeaderDirective },
    DragDrop,
  ],
})
export class NbColumnHeaderDirective implements NbTableDirective {
  @Input('nbColumnHeader') column: string;

  constructor(
    public template: TemplateRef<any>,
    private _element: ElementRef<HTMLElement>,
    _viewContainer: ViewContainerRef,
  ) { }
}

@Directive({
  selector: '[nbColumnCell]',
  providers: [
    { provide: NbTableDirective, useExisting: NbColumnCellDirective },
  ],
})
export class NbColumnCellDirective implements INbTableDirective {
  @Input('nbColumnCell') column: string;

  constructor(
    public template: TemplateRef<{ $implicit: TemplateRef<any>; dataItem: Record<string, unknown> }>,
    private _element: ElementRef,
    private _viewContainer: ViewContainerRef,
  ) { }
}

@Directive({
  selector: '[nbHeaderRow]',
  providers: [{ provide: NbTableDirective, useExisting: NbHeaderRowDirective }],
})
export class NbHeaderRowDirective implements INbTableDirective {
  constructor(
    public template: TemplateRef<any>,
    private _element: ElementRef,
    private _viewContainer: ViewContainerRef,
  ) { }
}

@Directive({
  selector: '[nbRow]',
  providers: [{ provide: NbTableDirective, useExisting: NbRowDirective }],
})
export class NbRowDirective implements INbTableDirective {
  constructor(
    public template: TemplateRef<any>,
    private _element: ElementRef,
    private _viewContainer: ViewContainerRef,
  ) { }
}

@Directive({
  selector: '[nbHeaderCell]',
  providers: [],
})
export class NbHeaderCellDirective extends CdkDrag implements OnInit {
  @Input('nbHeaderCellDrag') drag: boolean = false;
  @Input('nbHeaderCellDragData') dragData: unknown;

  ngOnInit(): void {
    this.element.nativeElement.classList.add('nb-header-cell');
    this.disabled = !this.drag;
  }
}

@Directive({
  selector: '[nbCell]',
  providers: [],
})
export class NbCellDirective implements AfterViewChecked, AfterViewInit, OnDestroy {
  @Input('nbCell') column: string;
  @Input('nbCellRow') set rowIndex(index: number) {
    if (index === null || index === undefined) return;
    this._rowIndex = index;
    this._element.nativeElement.classList.add('nb-table-cell');

    this._element.nativeElement.classList.toggle('nb-row-odd', (index + 1) % 2 !== 0);
    this._element.nativeElement.classList.toggle('nb-row-even', (index + 1) % 2 === 0);

    const cellId = `${this.column}-${this._rowIndex}`;
    this._tableService.registerCell(cellId);
  }

  private _rowIndex: number;
  private _subscription: Subscription;

  constructor(
    private _element: ElementRef,
    private _tableService: NbTableService,
  ) {

    effect(() => {
      const tableState = this._tableService.tableState();
      const cellId = `${this.column}-${this._rowIndex}`;

      const classList = this._element.nativeElement.classList;
      const spannedCells = tableState.spans;
      const hiddenCells = tableState.hiddenCells;

      for (var i = 0, l = classList.length; i < l; ++i) {
        if (/nb-span-.*/.test(classList[i])) {
          classList.remove(classList[i]);
        }
      }

      if (spannedCells.has(cellId)) {
        const span = spannedCells.get(cellId);
        this._element.nativeElement.classList.add(`nb-span-${span.span}`);
      }

      if (hiddenCells.includes(cellId)) {
        this._element.nativeElement.classList.add('nb-span-hidden');
      }

      // this._cd.detectChanges();
    });

    // this._tableService.tableState$.subscribe(tableState => {
    //   // console.count('check');
    //   const cellId = `${this.column}-${this._rowIndex}`;
    //   const classList = this._element.nativeElement.classList;
    //   const spannedCells = tableState.spans;
    //   const hiddenCells = tableState.hiddenCells;

    //   for (var i = 0, l = classList.length; i < l; ++i) {
    //     if (/nb-span-.*/.test(classList[i])) {
    //       classList.remove(classList[i]);
    //     }
    //   }

    //   if (spannedCells.has(cellId)) {
    //     const span = spannedCells.get(cellId);
    //     this._element.nativeElement.classList.add(`nb-span-${span.span}`);
    //   }

    //   if (hiddenCells.includes(cellId)) {
    //     this._element.nativeElement.classList.add('nb-span-hidden');
    //   }
    // });
  }

  ngAfterViewInit(): void {

  }

  ngAfterViewChecked(): void {
    const cellId = `${this.column}-${this._rowIndex}`;
    this._tableService.unregisterCell(cellId);
    // this._subscription = 
    // this._subscription = this._tableService.dataSource$.pipe(take(1), map(x => x.map(y => y[this.column.toLowerCase()]))).subscribe((dataSource) => {
    //   const cellId = `${this.column}${this._rowIndex}`;

    //   // Hide duplicate cells
    //   const duplicate = this._rowIndex !== 0 && dataSource[(this._rowIndex - 1)] === dataSource[this._rowIndex];
    //   this._element.nativeElement.classList.toggle('nb-hidden', duplicate);


    //   const span = dataSource.slice(this._rowIndex).filter((v, i, a) => (v === a[(i + 1)] || v === a[(i - 1)]) && v === a[0]);
    //   console.log(span);
    //   const spanConfig = { column: this.column, rowIndex: this._rowIndex, span: !duplicate ? span.length : null };


    //   if (this._tableService.spannedCells.has(cellId)) {
    //     console.log('remove', cellId);
    //     const currentSpan = this._tableService.spannedCells.get(cellId);
    //     console.log(currentSpan, this._element.nativeElement.classList);
    //     this._element.nativeElement.classList.remove(`nb-span-${currentSpan.span}`);
    //     this._tableService.spannedCells.delete(cellId);
    //   }

    //   if (spanConfig.span > 1 && spanConfig.rowIndex === this._rowIndex) {
    //     console.log('add', cellId);
    //     this._tableService.spannedCells.set(cellId, spanConfig);
    //     this._element.nativeElement.classList.add(`nb-span-${spanConfig?.span}`);
    //   }
    // });
  }

  ngOnDestroy(): void {
    // this._subscription.unsubscribe();
  }
}
