import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlanBasvuruComponent } from './ilan-basvuru.component';

describe('IlanBasvuruComponent', () => {
  let component: IlanBasvuruComponent;
  let fixture: ComponentFixture<IlanBasvuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlanBasvuruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlanBasvuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
