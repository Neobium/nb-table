import { Directionality } from '@angular/cdk/bidi';
import { CdkDrag, CdkDropList, CDK_DRAG_CONFIG, CDK_DROP_LIST, DragDrop, DragDropConfig } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional,
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
export class NbColumnHeaderDirective extends CdkDrag {
  @Input('nbColumnHeader') column: string;

  constructor(
    public template: TemplateRef<any>,
    private _element: ElementRef<HTMLElement>,
    @Inject(CDK_DROP_LIST) @Optional() @SkipSelf() _dropContainer: CdkDropList,
    @Inject(DOCUMENT) _document: any,
    _ngZone: NgZone,
    _viewContainer: ViewContainerRef,
    @Optional() @Inject(CDK_DRAG_CONFIG) _config: DragDropConfig,
    @Optional() _dir: Directionality,
    _dragDrop: DragDrop,
    _cd: ChangeDetectorRef,
  ) {
    super(_viewContainer.createEmbeddedView(template).rootNodes[0], _dropContainer, _document, _ngZone, _viewContainer, _config, _dir, _dragDrop, _cd);
    console.log(_viewContainer.createEmbeddedView(template).rootNodes[0]);
  }
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
    public template: TemplateRef<any>,
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
