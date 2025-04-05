import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBasvuruDurumComponent } from './admin-basvuru-durum.component';

describe('AdminBasvuruDurumComponent', () => {
  let component: AdminBasvuruDurumComponent;
  let fixture: ComponentFixture<AdminBasvuruDurumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBasvuruDurumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBasvuruDurumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
