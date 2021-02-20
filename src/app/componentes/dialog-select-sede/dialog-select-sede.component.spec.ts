import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectSedeComponent } from './dialog-select-sede.component';

describe('DialogSelectSedeComponent', () => {
  let component: DialogSelectSedeComponent;
  let fixture: ComponentFixture<DialogSelectSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelectSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
