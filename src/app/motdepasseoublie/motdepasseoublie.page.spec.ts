import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MotdepasseoubliePage } from './motdepasseoublie.page';

describe('MotdepasseoubliePage', () => {
  let component: MotdepasseoubliePage;
  let fixture: ComponentFixture<MotdepasseoubliePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotdepasseoubliePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MotdepasseoubliePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
