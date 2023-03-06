import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { CsvTemplateConfigComponent } from './csv-template-config.component';
import {TestingModule} from 'src/app/testing/testing.module';
import {CustomFormComponent} from '../custom/custom-form/custom-form.component';
import {CustomTableComponent} from '../custom/custom-table/custom-table.component';
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";

import {TableDataService} from "../../_services/table-data.service";
import {CSVTemplateConfigs} from "../../models/csvtemplate-configs.model";
import {PageService} from "../custom/custom-table/page.service";
import {PaginatedDataSource} from '../custom/custom-table/paginated-datasource';
import {By} from "@angular/platform-browser";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {
  DetailViewCsvTemplateConfigComponent
} from "../detail-view-csv-template-config/detail-view-csv-template-config.component";
import { DynamicFormComponent } from 'src/app/dynamic-view/dynamic-form/dynamic-form.component';

@Injectable()
class MockPaginatedDataSource {
  public data = []; // set data at test

  connect(): Observable<any> {
    return new Observable(obs => {
      setTimeout(() => obs.next(this.data), 500);
    })
  }
}

describe('CsvTemplateConfigComponent', () => {
  let component: CsvTemplateConfigComponent;
  let fixture: ComponentFixture<CsvTemplateConfigComponent>;
  let tableDataService: TableDataService;
  let dataSource = new MockPaginatedDataSource(); //: PaginatedDataSource<any, any>;
  let testCsvTemplateCofig: CSVTemplateConfigs[] = [
    {
      CSVCONFIG_ID: 1,
      CSVCONFIG_NAME: 'Customer template',
      CSVCONFIG_TYPE: 1,
      CSVCONFIG_ENCODING: '',
      CSVCONFIG_EOL: '',
      CSVCONFIG_DELIMITER: ''
    },
    {
      CSVCONFIG_ID: 1,
      CSVCONFIG_NAME: 'Order template',
      CSVCONFIG_TYPE: 2,
      CSVCONFIG_ENCODING: '',
      CSVCONFIG_EOL: '',
      CSVCONFIG_DELIMITER: ''
    },
  ];
  let pageService: PageService;


  beforeEach(() => {
    // @ts-ignore
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CsvTemplateConfigComponent, CustomTableComponent, CustomFormComponent, TranslateItPipe,
        DetailViewCsvTemplateConfigComponent, DynamicFormComponent],
      providers: [MessageService, TableDataService, PageService, TranslateItPipe,
        {provide: PaginatedDataSource, useValue: dataSource}],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvTemplateConfigComponent);
    component = fixture.componentInstance;
    tableDataService = TestBed.inject(TableDataService);
    pageService = TestBed.inject(PageService);

    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
//
//   it('can click new csvTemplateConfig button and call createItem function', fakeAsync(() => {
//
//     // Arrange
//     component.customTableComponent.first.showCreateButton = true;
//     fixture.detectChanges();
//     spyOn(component, 'createItem'); // method attached to the click.
//
//     // Act
//     const btn = fixture.debugElement.query(By.css('custom-table button')); // new csvTemplateConfig buton
//     btn.triggerEventHandler('click', null);
//     tick(); // simulates the passage of time until all pending asynchronous activities finish
//     fixture.detectChanges();
//
//     // Assert
//     expect(component.createItem).toHaveBeenCalled(); // not.
//   }));
//
//   it('should filter the dataSource', fakeAsync(() => {
//
//     // Arrange
//     let searchInput = component.customTableComponent.first.searchInput;
//     searchInput.nativeElement.value = 'Customer template';
//
//     // Act
//     component.ngOnInit();
//     tick();
//
//     searchInput.nativeElement.dispatchEvent(new Event('input'));
//
//     // Assert
//     expect(component.customTableComponent.first.dataSource.pageSize).toBe(14);
//   }));
//
//   it('should test the getDataSource and setDataSourceNew', fakeAsync((done) => {
//
//     // Arrange
//     // at the start items are empty => []
//     expect(component.customTableComponent.first.items).toEqual([]);
//     dataSource.data = testCsvTemplateCofig;
//     const callbackObject = {
//       func: () => {
//       }
//     };
//     const dataSourceResponse = testCsvTemplateCofig;
//     spyOn(component.customTableComponent.first, 'getDataSource').and.callThrough();
//     let pageResponse = {
//       content: testCsvTemplateCofig,
//       number: testCsvTemplateCofig.length,
//       size: 14,
//       totalElements: 1000
//     };
//     spyOn(pageService, 'page').and.returnValue(of(pageResponse));
//     spyOn(dataSource, 'connect').and.returnValue(of(dataSourceResponse)); // .and.callThrough();//
//     spyOn(component.customTableComponent.first, 'setDataSourceNew').and.callThrough();
//     spyOn(callbackObject, 'func');
//
//     // Act
//     component.ngOnInit();
//     tick();
//
//     // Assert
//     expect(component.customTableComponent.first.getDataSource).toHaveBeenCalled();
//     expect(component.customTableComponent.first.setDataSourceNew).toHaveBeenCalled();
//     expect(component.customTableComponent.first.items).toEqual(testCsvTemplateCofig);
//   }));
//
//   // ToDo: (fit) Table row cells data is not loaded.
//   it('should test the table view ', fakeAsync((done) => { // fakeAsync(
//
//     dataSource.connect();
//     const callbackObject = {
//       func: () => {
//       }
//     };
//
//     const query = {
//       search: "",
//       registration: new Date()
//     }
//     const request = {
//       page: 1,
//       offset: 0, // 0
//       size: 12,  // 14
//       // sort?: Sort<T>;
//     }
//     let pageResponse = {
//       content: testCsvTemplateCofig,
//       number: testCsvTemplateCofig.length,
//       size: 14,
//       totalElements: testCsvTemplateCofig.length
//     };
//     component.PAGINATOR_ELEMENTS_PER_SIDE = [14, 30];
//     component.currPageSize = 14;
//     component.formInitialized = false;
//     // component.customTableComponent.first.dataSource.connect();
//     spyOn(component.customTableComponent.first, "setPaginatedDataSource").and.callThrough();
//     spyOn(localStorage, 'getItem').and.returnValue('3'); // set localStorage getItem to return some value
//     spyOn(component.customTableComponent.first, 'getDataSource').and.callThrough();
//     spyOn(dataSource, 'connect').and.callThrough(); //.and.returnValue(of(dataSourceResponse));
//     spyOn(pageService, 'page').and.returnValue(of(pageResponse));
//     spyOn(component.customTableComponent.first, 'setDataSourceNew').and.callThrough();
//     spyOn(component.customTableComponent.first, 'setSelTableRow').and.callThrough();
//
//     spyOn(callbackObject, 'func');
//
//     // Act
//     component.ngOnInit();
//     tick();
//
//     pageService.page(request, query, "countries", "primaryColumn", "primaryValue",
//       "secondaryColumn", "secondaryValue", "searchColumn",
//       "additionalSearchColumns", true).subscribe(
//       (data) => {
//         expect(data).toEqual(pageResponse, 'should return table data');
//       },
//       () => fail('should have failed with error'),
//       () => {
//       }
//     );
//
//     // Assert
//     expect(component.customTableComponent.first.setPaginatedDataSource).toHaveBeenCalled();
//     expect(component.customTableComponent.first.getDataSource).toHaveBeenCalled();
//     expect(component.customTableComponent.first.setDataSourceNew).toHaveBeenCalled();
//     expect(component.customTableComponent.first.items).toEqual(testCsvTemplateCofig);
//     expect(component.customTableComponent.first.columnsToDisplay[0]).toEqual(component.displayedColumns[0]);
//     expect(component.customTableComponent.first.items[1].COUNTRY_NAME).toEqual('Belgien');
//     expect(component.customTableComponent.first.items.length).toBe(testCsvTemplateCofig.length);
//   }));
//
//   it('should set newCountryMode = true and call setAndLoadFormData', () => {
//
//     // Arrange
//
//     // Act
//     component.createItem();
//
//     // Assert
//     expect(component.newCSVTemplateConfigMode).toBeTruthy();
//   });
//
//   it('should set newCountryMode = true and not call setAndLoadFormData', () => {
//
//     // Arrange
//     component.customFormComponent = undefined;
//
//     // Act
//     component.createItem();
//
//     // Assert
//     expect(component.newCSVTemplateConfigMode).toBeTruthy();
//   });
});
