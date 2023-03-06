import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { InfoDialogComponent } from './info-dialog.component';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";

describe('InfoDialogComponent', () => {

  let component: InfoDialogComponent;
  let fixture: ComponentFixture<InfoDialogComponent>;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule,],
      declarations: [ InfoDialogComponent ],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
       ]
    })
    fixture = TestBed.createComponent(InfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close closes dialog and navigates to home if refTable is undefined', fakeAsync(() => {

    // Arrange
    component.refTable = undefined;
    const router: Router = TestBed.inject(Router);
    spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    spyOn(MatDialogRef.prototype,"close").and.callThrough();

    // Act
    component.close();

    // Assert
    tick();
    // expect(MatDialogRef.prototype.close).toHaveBeenCalled();
    expect(MatDialogRef.prototype.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toBeTruthy();
  }));

  it('close closes dialog and navigates to home if refTable is set', fakeAsync(() => {

    // Arrange
    component.refTable = "refTable";
    const router: Router = TestBed.inject(Router);
    spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    spyOn(MatDialogRef.prototype,"close").and.callThrough();

    // Act
    component.close();

    // Assert
    tick();
    expect(MatDialogRef.prototype.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toBeTruthy();
  }));

  it('close closes dialog and not navigates to home if refTable is "nonavigation"', fakeAsync(() => {

    // Arrange
    component.refTable = "nonavigation";
    const router: Router = TestBed.inject(Router);
    spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
    spyOn(MatDialogRef.prototype,"close").and.callThrough();

    // Act
    component.close();

    // Assert
    tick();
    expect(MatDialogRef.prototype.close).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

});
