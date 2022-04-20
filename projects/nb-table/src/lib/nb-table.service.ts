import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class SpannedCell {
  column: string;
  rowIndex: number;
  span: number;
}

class TableState {
  hiddenCells: string[];
  selectedColumns: string[];
  spans: Map<string, SpannedCell>;
}

@Injectable({
  providedIn: 'root'
})
export class NbTableService {
  private _dataSource: Record<string, unknown>[];
  private _dataSourceB$ = new BehaviorSubject<Record<string, unknown>[]>(null);
  dataSource$: Observable<Record<string, unknown>[]> = this._dataSourceB$.asObservable();

  tableState$: Observable<TableState>;
  private _selectedColumns = new Subject<string[]>();


  constructor() {
    this._observeSpannedCells();
  }

  setSource(source: Record<string, unknown>[]): void {
    this._dataSource = source;
    this._dataSourceB$.next(source);
  }

  setSelectedColumns(columns: string[]): void {
    this._selectedColumns.next(columns);
  }

  private _observeSpannedCells(): void {
    this.tableState$ = combineLatest([
      this.dataSource$.pipe(filter(x => !!x)),
      this._selectedColumns.asObservable()
    ]).pipe(map(([source, columns]) => this._mapToTableState(source, columns)));

    this.tableState$.subscribe(console.log);
  }

  private _mapToTableState(source: Record<string, unknown>[], columns: string[]): TableState {
    const spans = new Map<string, SpannedCell>();
    const hiddenCells = [];

    columns.forEach(column => {
      const dataColumn = source.map(x => x[column.toLowerCase()]);

      const columnSpans = dataColumn.reduce((acc: { id: string, span: number, value: unknown, index: number }[], prev, index) => {
        // console.log(prev, acc, index);

        if (!acc.length) acc.push({ id: `${column}-${index}`, span: 1, value: prev, index });
        else if (prev !== acc[acc.length - 1].value) acc.push({ id: `${column}-${index}`, span: 1, value: prev, index });
        else if (prev === acc[acc.length - 1].value) {
          acc[acc.length - 1].span++;
          hiddenCells.push(`${column}-${index}`);
        }

        return acc;
      }, []) as { id: string, span: number, value: unknown, index: number }[];

      columnSpans.filter(x => x.span > 1).forEach(x => {
        spans.set(x.id, { column: column, rowIndex: x.index, span: x.span })
      })
    })

    return { hiddenCells, selectedColumns: columns, spans };
  }
}
