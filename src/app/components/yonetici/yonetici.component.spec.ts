import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoneticiComponent } from './yonetici.component';

describe('YoneticiComponent', () => {
  let component: YoneticiComponent;
  let fixture: ComponentFixture<YoneticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoneticiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoneticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
