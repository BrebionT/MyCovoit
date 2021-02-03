import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfosTrajetPage } from './infos-trajet.page';

describe('InfosTrajetPage', () => {
  let component: InfosTrajetPage;
  let fixture: ComponentFixture<InfosTrajetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosTrajetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfosTrajetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
