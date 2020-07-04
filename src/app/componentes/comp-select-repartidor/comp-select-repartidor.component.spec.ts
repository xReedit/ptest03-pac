import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompSelectRepartidorComponent } from './comp-select-repartidor.component';

describe('CompSelectRepartidorComponent', () => {
  let component: CompSelectRepartidorComponent;
  let fixture: ComponentFixture<CompSelectRepartidorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompSelectRepartidorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompSelectRepartidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
