import { Directionality } from '@angular/cdk/bidi';
import { CdkDrag, CdkDropList, CDK_DRAG_CONFIG, CDK_DROP_LIST, DragDrop, DragDropConfig } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnInit,
  Optional,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

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

  ngOnInit(): void {
    this.element.nativeElement.classList.add('nb-header-cell');
    this.disabled = !this.drag;
  }
}

@Directive({
  selector: '[nbCell]',
  providers: [],
})
export class NbCellDirective {
  @Input('nbCell') set rowIndex(index: number) {
    if (index === null || index === undefined) return;
    this._element.nativeElement.classList.add('nb-table-cell');

    this._element.nativeElement.classList.toggle('nb-row-odd', index % 2 !== 0);
    this._element.nativeElement.classList.toggle('nb-row-even', index % 2 === 0);
  }

  constructor(
    private _element: ElementRef
  ) { }
}
