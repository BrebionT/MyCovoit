import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechercherPage } from './rechercher.page';

describe('RechercherPage', () => {
  let component: RechercherPage;
  let fixture: ComponentFixture<RechercherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercherPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechercherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});