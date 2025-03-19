import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleManagementComponent } from './admin-role-management.component';

describe('AdminRoleManagementComponent', () => {
  let component: AdminRoleManagementComponent;
  let fixture: ComponentFixture<AdminRoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
