import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlanKriterBasvuruComponent } from './ilan-kriter-basvuru.component';

describe('IlanKriterBasvuruComponent', () => {
  let component: IlanKriterBasvuruComponent;
  let fixture: ComponentFixture<IlanKriterBasvuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlanKriterBasvuruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlanKriterBasvuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
