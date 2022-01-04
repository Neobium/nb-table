import { Component } from '@angular/core';
import { Person } from './services/people.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tableColumns: string[] = Object.keys(new Person());
}
