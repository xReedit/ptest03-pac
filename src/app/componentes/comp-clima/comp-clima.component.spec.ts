import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompClimaComponent } from './comp-clima.component';

describe('CompClimaComponent', () => {
  let component: CompClimaComponent;
  let fixture: ComponentFixture<CompClimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompClimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompClimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
