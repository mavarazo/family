import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealdateListComponent } from './mealdate-list.component';

describe('MealdateListComponent', () => {
  let component: MealdateListComponent;
  let fixture: ComponentFixture<MealdateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealdateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealdateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
