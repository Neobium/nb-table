import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Datasource,
  PeopleService,
  Person,
} from 'src/app/services/people.service';

@Component({
  selector: 'app-nb-table',
  templateUrl: './nb-table.component.html',
  styleUrls: ['./nb-table.component.scss'],
  providers: [PeopleService],
})
export class NbTableComponent implements OnInit, AfterContentInit {
  @Input() columns: string[];

  datasource$: Observable<Datasource<Person>>;

  constructor(private _peopleService: PeopleService) {
    console.time('render nb-table');
  }

  ngOnInit(): void {
    this.datasource$ = this._peopleService.getPeople$(25);
  }

  ngAfterContentInit(): void {
    console.timeEnd('render nb-table');
  }

  clickRow(row: any): void {
    console.log('Clicked', row);
  }

  sortByColumn(column: string): void {
    this._peopleService.sortData(column.toLowerCase());
  }

  sortByColumns(columns: Array<string>): void {
    if (columns?.length >= 1) this._peopleService.sortData(columns[0].toLowerCase());
  }
}
