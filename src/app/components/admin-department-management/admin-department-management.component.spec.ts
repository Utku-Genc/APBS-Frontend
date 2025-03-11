import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartmentManagementComponent } from './admin-department-management.component';

describe('AdminDepartmentManagementComponent', () => {
  let component: AdminDepartmentManagementComponent;
  let fixture: ComponentFixture<AdminDepartmentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDepartmentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDepartmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
