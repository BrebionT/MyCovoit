import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ConditionGenPage } from './conditionGen.page';

describe('ConditionGenPage', () => {
  let component: ConditionGenPage;
  let fixture: ComponentFixture<ConditionGenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConditionGenPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConditionGenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
