import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasUsuarioComponent } from './reservas-usuario.component';

describe('ReservasUsuarioComponent', () => {
  let component: ReservasUsuarioComponent;
  let fixture: ComponentFixture<ReservasUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservasUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
