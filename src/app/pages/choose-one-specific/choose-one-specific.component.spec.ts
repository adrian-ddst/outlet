import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOneSpecificComponent } from './choose-one-specific.component';

describe('ChooseOneSpecificComponent', () => {
  let component: ChooseOneSpecificComponent;
  let fixture: ComponentFixture<ChooseOneSpecificComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseOneSpecificComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseOneSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
