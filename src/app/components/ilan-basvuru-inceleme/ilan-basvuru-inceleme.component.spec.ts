import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IlanBasvuruIncelemeComponent } from './ilan-basvuru-inceleme.component';

describe('IlanBasvuruIncelemeComponent', () => {
  let component: IlanBasvuruIncelemeComponent;
  let fixture: ComponentFixture<IlanBasvuruIncelemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IlanBasvuruIncelemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IlanBasvuruIncelemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
