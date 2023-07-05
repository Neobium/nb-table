import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Datasource,
  PeopleService,
  Person,
} from 'src/app/services/people.service';

@Component({
  selector: 'app-ng-table',
  templateUrl: './ng-table.component.html',
  styleUrls: ['./ng-table.component.scss'],
  providers: [PeopleService],
})
export class NgTableComponent implements OnInit, AfterContentInit {
  @Input() columns: string[];

  datasource$: Observable<Datasource<Person>>;

  constructor(private _peopleService: PeopleService) {
    console.time('render ng-table');
  }

  ngOnInit(): void {
    this.datasource$ = this._peopleService.getPeople$(25);
  }

  ngAfterContentInit(): void {
    console.timeEnd('render ng-table');
  }

  clickRow(row: any): void {
    console.log('Clicked', row);
  }

  sortByColumn(column: string): void {
    this._peopleService.sortData(column.toLowerCase());
  }
}
