import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIlanManagementComponent } from './admin-ilan-management.component';

describe('AdminIlanManagementComponent', () => {
  let component: AdminIlanManagementComponent;
  let fixture: ComponentFixture<AdminIlanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminIlanManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIlanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
