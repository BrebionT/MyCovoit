import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfilAutrePage } from './profil-autre.page';

describe('ProfilAutrePage', () => {
  let component: ProfilAutrePage;
  let fixture: ComponentFixture<ProfilAutrePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilAutrePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilAutrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
