import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealdateComponent } from './mealdate.component';

describe('MealdateComponent', () => {
  let component: MealdateComponent;
  let fixture: ComponentFixture<MealdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
