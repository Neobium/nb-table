import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbTableComponent } from './nb-table.component';

describe('NbTableComponent', () => {
  let component: NbTableComponent;
  let fixture: ComponentFixture<NbTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NbTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
