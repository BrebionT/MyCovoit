import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoterPage } from './noter.page';

describe('NoterPage', () => {
  let component: NoterPage;
  let fixture: ComponentFixture<NoterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
