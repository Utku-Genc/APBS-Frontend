import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoneticiIlanJuriComponent } from './yonetici-ilan-juri.component';

describe('YoneticiIlanJuriComponent', () => {
  let component: YoneticiIlanJuriComponent;
  let fixture: ComponentFixture<YoneticiIlanJuriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoneticiIlanJuriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoneticiIlanJuriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
