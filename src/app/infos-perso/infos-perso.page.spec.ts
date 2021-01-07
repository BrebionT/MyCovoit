import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfosPersoPage } from './infos-perso.page';

describe('InfosPersoPage', () => {
  let component: InfosPersoPage;
  let fixture: ComponentFixture<InfosPersoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosPersoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfosPersoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
