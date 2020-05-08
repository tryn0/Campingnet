import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasRegistrarComponent } from './reservas-registrar.component';

describe('ReservasRegistrarComponent', () => {
  let component: ReservasRegistrarComponent;
  let fixture: ComponentFixture<ReservasRegistrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservasRegistrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservasRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
