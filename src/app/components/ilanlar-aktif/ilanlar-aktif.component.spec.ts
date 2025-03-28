import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlanlarAktifComponent } from './ilanlar-aktif.component';

describe('IlanlarAktifComponent', () => {
  let component: IlanlarAktifComponent;
  let fixture: ComponentFixture<IlanlarAktifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlanlarAktifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlanlarAktifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
