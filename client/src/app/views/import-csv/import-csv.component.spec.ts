import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ImportCsvComponent} from './import-csv.component';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';
import {MatDialog} from '@angular/material/dialog';
import {TestingModule} from '../../testing/testing.module';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';


// @link https://stackoverflow.com/a/54693988
export class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of({action: true})
    };
  }
}

describe('ImportCsvComponent', () => {
  let component: ImportCsvComponent;
  let fixture: ComponentFixture<ImportCsvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, RouterTestingModule],
      declarations: [ImportCsvComponent, TranslateItPipe],
      providers: [TranslateItPipe, { provide: MatDialog, useClass: MatDialogMock } ]
    })

    fixture = TestBed.createComponent(ImportCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
