import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ProposerPage } from './proposer.page';

describe('ProposerPage', () => {
  let component: ProposerPage;
  let fixture: ComponentFixture<ProposerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProposerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


