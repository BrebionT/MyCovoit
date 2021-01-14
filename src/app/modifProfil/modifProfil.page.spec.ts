import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModifProfilPage } from './modifProfil.page';

describe('ModifProfilPage', () => {
  let component: ModifProfilPage;
  let fixture: ComponentFixture<ModifProfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifProfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModifProfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});