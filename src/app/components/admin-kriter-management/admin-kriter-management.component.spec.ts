import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKriterManagementComponent } from './admin-kriter-management.component';

describe('AdminKriterManagementComponent', () => {
  let component: AdminKriterManagementComponent;
  let fixture: ComponentFixture<AdminKriterManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminKriterManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminKriterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
