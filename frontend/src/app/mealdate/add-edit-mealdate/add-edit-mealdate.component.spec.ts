import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMealdateComponent } from './add-edit-mealdate.component';

describe('AddEditMealdateComponent', () => {
  let component: AddEditMealdateComponent;
  let fixture: ComponentFixture<AddEditMealdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMealdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMealdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
