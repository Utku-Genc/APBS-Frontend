import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BildirimlerComponent } from './bildirimler.component';

describe('BildirimlerComponent', () => {
  let component: BildirimlerComponent;
  let fixture: ComponentFixture<BildirimlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BildirimlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BildirimlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
