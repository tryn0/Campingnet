import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlojamientoComponent } from './alojamiento.component';

describe('AlojamientoComponent', () => {
  let component: AlojamientoComponent;
  let fixture: ComponentFixture<AlojamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlojamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlojamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
