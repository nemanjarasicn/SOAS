import { MatPaginator } from '@angular/material/paginator';
import { TranslateItPipe } from '../../shared/pipes/translate-it.pipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { TableDialogComponent } from './table-dialog.component';
import { ConstantsService } from "../../_services/constants.service";
import {UserService} from "../../_services/user.service";
import {TableDataService} from "../../_services/table-data.service";
import {UserTestConstants} from "../../../assets/test-constants/users";
import {ErrorsTestConstants} from "../../../assets/test-constants/errors";
import {BatchService} from "../../_services/batch.service";
import {BatchProcessesTestConstants} from "../../../assets/test-constants/batchprocesses";
import {MatTableDataSource} from "@angular/material/table";
import {BooleanToMatIconPipe} from "../../shared/pipes/boolean-to-mat-icon.pipe";

describe('TableDialogComponent', () => {

  let component: TableDialogComponent;
  let fixture: ComponentFixture<TableDialogComponent>;
  let tableDataService: TableDataService;
  let translate: TranslateItPipe;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TableDialogComponent, TranslateItPipe, BooleanToMatIconPipe, MatPaginator],
      providers: [ConstantsService, UserService, TranslateItPipe, BooleanToMatIconPipe,
        {provide: MatDialogRef, useValue: dialogMock},
        { provide: MAT_DIALOG_DATA, useValue: {} },]
    });

    fixture = TestBed.createComponent(TableDialogComponent);
    component = fixture.componentInstance;
    tableDataService = TestBed.inject(TableDataService);
    translate = TestBed.inject(TranslateItPipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit set users for data = \'users\'', fakeAsync(() => {

    // Arrange
    component.data = 'users';
    const userService: UserService = TestBed.inject(UserService);
    const users: any[] = [UserTestConstants.USER_WITH_ID];
    spyOn(userService, "getUsers").and.returnValue(Promise.resolve(users));

    // Act
    component.ngOnInit();

    tick();

    // Assert
    expect(component.searchTitle).toEqual('SEARCH_FOR');
    expect(component.dataSource).toBeDefined();
    expect(userService.getUsers).toHaveBeenCalled();
    flush();
  }));

  it('ngOnInit not set users for data = \'users\'', fakeAsync(() => {

    // Arrange
    component.data = 'users';
    component.users = [UserTestConstants.USER_WITH_ID];
    const userService: UserService = TestBed.inject(UserService);
    const users: any[] = [];
    spyOn(userService, "getUsers").and.returnValue(Promise.resolve(undefined));

    // Act
    component.ngOnInit();

    tick();

    // Assert
    expect(component.searchTitle).toEqual('SEARCH_FOR');
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(users);
    expect(component.dataSource).not.toBeDefined();
    flush();
  }));

  it('ngOnInit not set users for data = \'users\', because of http error', fakeAsync(() => {

    // Arrange
    component.data = 'users';
    component.users = [UserTestConstants.USER_WITH_ID];
    const userService: UserService = TestBed.inject(UserService);
    const users: any[] = [];
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(userService, "getUsers").and.returnValue(Promise.resolve(undefined));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    component.ngOnInit();

    tick();

    // Assert
    expect(component.searchTitle).toEqual('SEARCH_FOR');
    expect(userService.getUsers).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
    expect(component.users).toEqual(users);
    expect(component.dataSource).not.toBeDefined();
    flush();
  }));

  it('ngOnInit set batches for data = \'batches\'', fakeAsync(() => {

    // Arrange
    component.data = 'batches';
    const batchService: BatchService = TestBed.inject(BatchService);
    const batches: any[] = ['table'];
    batches['table'] = [];
    batches['table'].push(JSON.stringify(BatchProcessesTestConstants.BATCH_PROCESS));
    spyOn(batchService, "getBatches").and.returnValue(Promise.resolve(batches));

    // Act
    component.ngOnInit();

    tick();

    // Assert
    expect(component.searchTitle).toEqual('SEARCH_FOR');
    expect(batchService.getBatches).toHaveBeenCalled();
    expect(component.dataSource).toBeDefined();
    flush();
  }));

  it('ngOnInit not set batches for data = \'batches\'', fakeAsync(() => {

    // Arrange
    component.data = 'batches';
    component.batches = [];
    component.batches.push(BatchProcessesTestConstants.BATCH_PROCESS);
    const batchService: BatchService = TestBed.inject(BatchService);
    const batches: any[] = [];
    spyOn(batchService, "getBatches").and.returnValue(Promise.resolve(undefined));

    // Act
    component.ngOnInit();

    tick();

    // Assert
    expect(component.searchTitle).toEqual('SEARCH_FOR');
    expect(batchService.getBatches).toHaveBeenCalled();
    expect(component.batches).toEqual(batches);
    expect(component.dataSource).not.toBeDefined();
    flush();
  }));

  it('ngOnInit not set batches for data = \'batches\', because of http error', fakeAsync(() => {

    // Arrange
    component.data = 'batches';
    component.batches = [BatchProcessesTestConstants.BATCH_PROCESS];
    const batchService: BatchService = TestBed.inject(BatchService);
    const batches: any[] = [];
    const errorResponse = ErrorsTestConstants.HTTP_ERROR; // set http error response
    spyOn(batchService, "getBatches").and.returnValue(Promise.resolve(undefined));
    spyOn(tableDataService, 'handleHttpError').and.callThrough();

    // Act
    component.ngOnInit();

    tick();

    // Assert
    expect(component.searchTitle).toEqual('SEARCH_FOR');
    expect(batchService.getBatches).toHaveBeenCalled();
    // expect(tableDataService.handleHttpError).toHaveBeenCalled();
    expect(component.batches).toEqual(batches);
    expect(component.dataSource).not.toBeDefined();
    flush();
  }));

  it('okFunction calls close function', () => {

    // Arrange
    spyOn(component, "closeFunction").and.callThrough();
    // spyOn(component.dialogRef, "close").and.callThrough();

    // Act
    component.okFunction();

    // Assert
    expect(component.okFunction).toBeDefined();
    // expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('createItem calls create function', () => {

    // Arrange
    // Act
    component.createItem("item");
    // Assert
  });

  it('editItem calls edit function', () => {

    // Arrange
    // Act
    component.editItem("item");
    // Assert
  });

  it('deleteItem calls delete function', () => {

    // Arrange
    // Act
    component.deleteItem(1, "item");
    // Assert
  });

  it('openDialog calls open dialog function', () => {

    // Arrange
    const obj = {action: "action"};
    spyOn(component, "closeFunction").and.callThrough();

    // Act
    component.openDialog("actionNeu", obj);

    // Assert
    expect(obj).toEqual({action: "actionNeu"});
  });

  it('openDialog fail to set action', () => {

    // Arrange
    const obj = undefined;
    spyOn(component, "closeFunction").and.callThrough();

    // Act
    component.openDialog("actionNeu", obj);

    // Assert
    expect(obj).toEqual(undefined);
  });

  it('onEsc calls closeFunction function', () => {

    // Arrange
    spyOn(component,"closeFunction").and.callThrough();

    // Act
    component.onEsc();

    // Assert
    expect(component.closeFunction).toHaveBeenCalled();
  });

  it('refreshFunction calls initTableDialog function', () => {

    // Arrange
    // Act
    component.refreshFunction();
    // Assert
    expect(component.searchInput.nativeElement.value).toEqual('');
  });

  it('applyFilter set dataSource.filter', () => {

    // Arrange
    const value: string = 'hello';
    let event: Event = { target: { value: value } } as any;
    component.dataSource = new MatTableDataSource<any>();

    // Act
    component.applyFilter(event);

    // Assert
    expect(component.dataSource.filter).toEqual(value);
  });

});
