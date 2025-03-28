import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlanlarPasifComponent } from './ilanlar-pasif.component';

describe('IlanlarPasifComponent', () => {
  let component: IlanlarPasifComponent;
  let fixture: ComponentFixture<IlanlarPasifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlanlarPasifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlanlarPasifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
