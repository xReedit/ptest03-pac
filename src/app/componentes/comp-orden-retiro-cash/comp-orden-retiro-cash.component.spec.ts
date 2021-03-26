import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOrdenRetiroCashComponent } from './comp-orden-retiro-cash.component';

describe('CompOrdenRetiroCashComponent', () => {
  let component: CompOrdenRetiroCashComponent;
  let fixture: ComponentFixture<CompOrdenRetiroCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompOrdenRetiroCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOrdenRetiroCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
