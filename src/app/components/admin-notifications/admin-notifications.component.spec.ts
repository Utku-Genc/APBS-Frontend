import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificationsComponent } from './admin-notifications.component';

describe('AdminNotificationsComponent', () => {
  let component: AdminNotificationsComponent;
  let fixture: ComponentFixture<AdminNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
