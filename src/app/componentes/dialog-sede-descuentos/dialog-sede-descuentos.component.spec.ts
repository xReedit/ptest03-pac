import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSedeDescuentosComponent } from './dialog-sede-descuentos.component';

describe('DialogSedeDescuentosComponent', () => {
  let component: DialogSedeDescuentosComponent;
  let fixture: ComponentFixture<DialogSedeDescuentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSedeDescuentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSedeDescuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
