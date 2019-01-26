import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowConfigComponent } from './show-config.component';

describe('ShowConfigComponent', () => {
  let component: ShowConfigComponent;
  let fixture: ComponentFixture<ShowConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
