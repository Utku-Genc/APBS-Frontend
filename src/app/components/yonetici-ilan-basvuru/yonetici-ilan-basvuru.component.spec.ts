import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoneticiIlanBasvuruComponent } from './yonetici-ilan-basvuru.component';

describe('YoneticiIlanBasvuruComponent', () => {
  let component: YoneticiIlanBasvuruComponent;
  let fixture: ComponentFixture<YoneticiIlanBasvuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoneticiIlanBasvuruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoneticiIlanBasvuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
