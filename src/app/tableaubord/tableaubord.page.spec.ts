import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TableaubordPage } from './tableaubord.page';

describe('TableaubordPage', () => {
  let component: TableaubordPage;
  let fixture: ComponentFixture<TableaubordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableaubordPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TableaubordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});