import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { RecherchetrajetPage } from './recherchetrajet.page';

describe('RecherchetrajetPage', () => {
  let component: RecherchetrajetPage;
  let fixture: ComponentFixture<RecherchetrajetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecherchetrajetPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RecherchetrajetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});