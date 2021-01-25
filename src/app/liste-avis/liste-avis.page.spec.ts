import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListeAvisPage } from './liste-avis.page';

describe('ListeAvisPage', () => {
  let component: ListeAvisPage;
  let fixture: ComponentFixture<ListeAvisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeAvisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListeAvisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
