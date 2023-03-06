import {ConfirmationService} from 'primeng/api';
import {ConstantsService} from '../../_services/constants.service';
import {TestingModule} from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {UserManagementComponent} from './user-management.component';
import {TableDataService} from "../../_services/table-data.service";
import {of} from "rxjs";
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {TableDialogComponent} from "../table-dialog/table-dialog.component";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";


describe('UserManagementComponent', () => {

  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let translate: TranslateItPipe;
  const dialogMock = {
    open: () => {
      return {
        deleteItem: () => of({action: true})
      };
    },
    // componentInstance: { deleteItem: () => {}}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [UserManagementComponent, TableDialogComponent, TranslateItPipe],
      providers: [ConstantsService, ConfirmationService, TranslateItPipe,
        {provide: MatDialogRef, useValue: dialogMock},]
    })

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateItPipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls setupClick function', () => {

    // Arrange
    spyOn(component, "setupClick").and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.setupClick).toHaveBeenCalled();
  });

  it('setupClick call', fakeAsync(  (done) => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(component, "userManagementClick").and.callThrough();
    spyOn(tableDataService, "removeAllTableLocks").and.callThrough();

    // Act
    component.setupClick().then(() => {
      done();
    });

    // Assert
    expect(component.userManagementClick).toHaveBeenCalled();
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();
    expect(MatDialogRef).toBeDefined();
  }));

  it('userManagementClick should open dialog', async () => {

    // Arrange
    const tableDataService: TableDataService = TestBed.inject(TableDataService);
    spyOn(component, "userManagementClick").and.callThrough();
    spyOn(tableDataService, "removeAllTableLocks").and.callThrough();
    spyOn(tableDataService, "deleteTableLocks").and.returnValue(Promise.resolve([]));
    spyOn(component.matDialog, "open").and.callThrough();

    // Act
    await component.userManagementClick("deleteTitle");

    // Assert
    expect(component.userManagementClick).toHaveBeenCalled();
    expect(tableDataService.removeAllTableLocks).toHaveBeenCalled();
    expect(tableDataService.deleteTableLocks).toHaveBeenCalled();
    expect(component.matDialog.open).toHaveBeenCalled();
  });

  it('userManagementClick should open dialog and create item ', () => {

    // Arrange
    const dialogRef = component.matDialog.open(TableDialogComponent, {data: {param: '1'}});
    spyOn(dialogRef.componentInstance, "createItem").and.callThrough();

    // Act
    dialogRef.componentInstance.createItem("");

    // Assert
    expect(dialogRef.componentInstance instanceof TableDialogComponent).toBe(true);
    expect(dialogRef.componentInstance.createItem).toBeDefined();
    expect(dialogRef.componentInstance.createItem).toHaveBeenCalled();
  });

  it('should reset dialog ', () => {

    // Arrange
    component.dialogConfig = new MatDialogConfig();

    // Act
    component.resetDialog();

    // Assert
    expect(component.dialogConfig).not.toBeDefined();
  });
});
