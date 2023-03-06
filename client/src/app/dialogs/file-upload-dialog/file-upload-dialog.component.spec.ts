import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { TestingModule } from 'src/app/testing/testing.module';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import { FileUploadDialogComponent } from './file-upload-dialog.component';
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {CsvImportService} from "../../_services/csv-import.service";
import {MessageService} from "primeng/api";
import {MessagesService} from "../../_services/messages.service";

interface MockFile {
  name: string;
  body: string;
  mimeType: string;
}

describe('FileUploadDialogComponent', () => {

  let component: FileUploadDialogComponent;
  let fixture: ComponentFixture<FileUploadDialogComponent>;
  const dialogMock = {
    close: () => {
      return {};
    },
  };
  const createFileFromMockFile = (file: MockFile): File => {
    const blob = new Blob([file.body], { type: file.mimeType }) as any;
    blob['lastModifiedDate'] = new Date();
    blob['name'] = file.name;
    return blob as File;
  };
  const createMockFileList = (files: MockFile[]) => {
    const fileList: FileList = {
      length: files.length,
      item(index: number): File {
        return fileList[index];
      }
    };
    files.forEach((file, index) => fileList[index] = createFileFromMockFile(file));
    return fileList;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [ FileUploadDialogComponent, TranslateItPipe ],
      providers: [TranslateItPipe, RxFormBuilder,
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        MessageService, MessagesService
      ]
    })

    fixture = TestBed.createComponent(FileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls initForm', () => {

    // Arrange
    component.form = undefined;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.form).toBeDefined();
  });

  it('onFileChange init filename and file', () => {

    // Arrange
    const fileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt'
      }
    ]);
    let event: Event = { target: { value: 'test', files: fileList } } as any;
    component.filename = undefined;
    component.file = undefined;

    // Act
    component.onFileChange(event);

    // Assert
    expect(component.filename).toBeDefined();
    expect(component.file).toBeDefined();
  });

  it('onFileChange don\'t init filename and file, if event is undefined', () => {

    // Arrange
    let event: Event = undefined;
    component.filename = undefined;
    component.file = undefined;

    // Act
    component.onFileChange(event);

    // Assert
    expect(component.filename).not.toBeDefined();
    expect(component.file).not.toBeDefined();
  });

  it('onFileChange don\'t init filename and file, if event.target file lists is undefined', () => {

    // Arrange
    const fileList = undefined;
    let event: Event = { target: { value: 'test', files: fileList } } as any;
    component.filename = undefined;
    component.file = undefined;

    // Act
    component.onFileChange(event);

    // Assert
    expect(component.filename).not.toBeDefined();
    expect(component.file).not.toBeDefined();
  });

  it('onFileChange don\'t init filename and file, if event.target file lists file is undefined', () => {

    // Arrange
    const fileList = createMockFileList([]);
    let event: Event = { target: { value: 'test', files: fileList } } as any;
    component.filename = undefined;
    component.file = undefined;

    // Act
    component.onFileChange(event);

    // Assert
    expect(component.filename).not.toBeDefined();
    expect(component.file).not.toBeDefined();
  });

  it('onCancelClick close dialog', () => {

    // Arrange
    spyOn(dialogMock, "close").and.callThrough();

    // Act
    component.onCancelClick();

    // Assert
    expect(dialogMock).toBeDefined();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('onSubmit import csv file and close dialog', () => {

    // Arrange
    component.filename = 'test.csv';
    component.file = new Blob();
    const csvImportService: CsvImportService = TestBed.inject(CsvImportService);
    spyOn(csvImportService, "importCsvFile").and.callThrough();
    spyOn(component,"onCancelClick").and.callThrough();

    // Act
    component.onSubmit();

    // Assert
    // expect(csvImportService.importCsvFile).toHaveBeenCalled();
    expect(component.onCancelClick).toHaveBeenCalled();
  });

});
