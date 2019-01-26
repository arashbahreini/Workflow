import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLogComponent } from './graph-log.component';

describe('GraphLogComponent', () => {
  let component: GraphLogComponent;
  let fixture: ComponentFixture<GraphLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
