import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOrdeExpressComponent } from './comp-orde-express.component';

describe('CompOrdeExpressComponent', () => {
  let component: CompOrdeExpressComponent;
  let fixture: ComponentFixture<CompOrdeExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompOrdeExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOrdeExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
