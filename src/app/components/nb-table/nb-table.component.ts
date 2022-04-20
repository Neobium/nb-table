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

  private _startTime: number = new Date().getTime();
  endTime: number;

  constructor(private _peopleService: PeopleService) { }

  ngOnInit(): void {
    this.datasource$ = this._peopleService.getPeople$(25);
  }

  ngAfterContentInit(): void {
    this.endTime = new Date().getTime() - this._startTime;
  }

  clickRow(row: any): void {
    console.log('Clicked', row);
  }

  sortByColumn(column: string): void {
    this._peopleService.sortData(column.toLowerCase());
  }

  sortByColumns(columns: Array<string>): void {
    console.log(columns);
    if (columns?.length >= 1) this._peopleService.sortData(columns[0].toLowerCase());
  }
}
