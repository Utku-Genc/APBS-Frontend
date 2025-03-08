import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsFormsComponent } from './cards.forms.component';

describe('CardsFormsComponent', () => {
  let component: CardsFormsComponent;
  let fixture: ComponentFixture<CardsFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
