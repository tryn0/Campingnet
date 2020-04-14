import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaneldeControlComponent } from './panelde-control.component';

describe('PaneldeControlComponent', () => {
  let component: PaneldeControlComponent;
  let fixture: ComponentFixture<PaneldeControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaneldeControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaneldeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
