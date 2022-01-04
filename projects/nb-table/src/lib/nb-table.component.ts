import { Component, Input, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'nb-table',
  templateUrl: './nb-table.component.html',
  styleUrls: ['./nb-table.component.scss'],
})
export class NbTableComponent implements OnInit {
  @Input() set dataSource(source: Record<string, unknown>[]) {
    console.log('nb data', source);
    this._dataSource = source;
  }

  private _dataSource: Record<string, unknown>[];

  // TODO: probably move to NbTableService
  private _dataSourceR$ = new ReplaySubject<Record<string, unknown>[]>(1);

  constructor() {
    this._dataSourceR$.next(this._dataSource);
  }

  ngOnInit(): void {}
}
