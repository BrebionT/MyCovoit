import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DeconnexionPage } from './deconnexion.page';

describe('DeconnexionPage', () => {
  let component: DeconnexionPage;
  let fixture: ComponentFixture<DeconnexionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeconnexionPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeconnexionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
