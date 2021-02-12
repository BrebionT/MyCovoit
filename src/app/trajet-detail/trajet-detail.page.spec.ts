import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrajetDetailPage } from './trajet-detail.page';

describe('TrajetDetailPage', () => {
  let component: TrajetDetailPage;
  let fixture: ComponentFixture<TrajetDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
