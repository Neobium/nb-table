import {
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { DirectiveContainer } from './nb-table-directives/directive-container';
import {
  INbTableDirective,
  NbColumnCellDirective,
  NbColumnHeaderDirective,
  NbHeaderRowDirective,
  NbRowDirective,
  NbTableDirective,
} from './nb-table-directives/directives/nb-table.directive';

@Component({
  selector: 'nb-table',
  templateUrl: './nb-table.component.html',
  styleUrls: ['./nb-table.component.scss'],
})
export class NbTableComponent implements OnInit {
  @ContentChildren(NbTableDirective) set cells(_cells: QueryList<INbTableDirective>) {
    console.log(_cells.toArray());
    this._directiveContainer = new DirectiveContainer(_cells);
    this.headerRows = this._directiveContainer.getHeaderRowDirectives();
    this.columnHeaders = this._directiveContainer.getColumnHeaderDirectives();
    this.tableRows = this._directiveContainer.getRowDirectives();
    this.tableCells = this._directiveContainer.getColumnCellDirectives();
  }

  @Input() set dataSource(source: Record<string, unknown>[]) {
    console.log('nb data', source);
    this._dataSource = source;
    this._dataSourceR$.next(this._dataSource);
  }

  private _directiveContainer: DirectiveContainer;
  headerRows: NbHeaderRowDirective[];
  columnHeaders: NbColumnHeaderDirective[];
  tableRows: NbRowDirective[];
  tableCells: NbColumnCellDirective[];

  private _dataSource: Record<string, unknown>[];

  // TODO: probably move to NbTableService
  private _dataSourceR$ = new ReplaySubject<Record<string, unknown>[]>(1);
  dataSource$: Observable<Record<string, unknown>[]> = this._dataSourceR$.asObservable();

  constructor() {
    // console.log('nb data', this._dataSource);
  }

  ngOnInit(): void { }
}
