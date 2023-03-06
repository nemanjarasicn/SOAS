import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { PageNotFoundComponent } from './page-not-found.component';
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {TableDataService} from "../../_services/table-data.service";


describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ PageNotFoundComponent, TranslateItPipe ],
      providers: [TranslateItPipe]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to home', () => {

    // Arrange
    const tableDataService = TestBed.inject(TableDataService);
    spyOn(tableDataService, "redirectTo").and.callThrough();

    // Act
    component.redirectToHome();

    // Assert
    expect(tableDataService.redirectTo).toHaveBeenCalled();

  });

});
