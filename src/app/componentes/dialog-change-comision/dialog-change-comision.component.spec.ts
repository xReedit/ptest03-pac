import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeComisionComponent } from './dialog-change-comision.component';

describe('DialogChangeComisionComponent', () => {
  let component: DialogChangeComisionComponent;
  let fixture: ComponentFixture<DialogChangeComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChangeComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangeComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
