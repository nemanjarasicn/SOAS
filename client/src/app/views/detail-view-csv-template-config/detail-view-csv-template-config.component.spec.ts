import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewCsvTemplateConfigComponent } from './detail-view-csv-template-config.component';
import {TestingModule} from "../../testing/testing.module";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";
import {MessageService} from "primeng/api";
import {DynamicFormComponent} from "../../dynamic-view/dynamic-form/dynamic-form.component";
import {CustomTableComponent} from "../custom/custom-table/custom-table.component";
import {CustomFormComponent} from "../custom/custom-form/custom-form.component";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {MatSelectModule} from "@angular/material/select";

describe('DetailViewCsvTemplateConfigComponent', () => {
  let component: DetailViewCsvTemplateConfigComponent;
  let fixture: ComponentFixture<DetailViewCsvTemplateConfigComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MatSelectModule],
      declarations: [DetailViewCsvTemplateConfigComponent, TranslateItPipe, DynamicFormComponent, CustomTableComponent,
        CustomFormComponent],
      providers: [TranslateItPipe, MessageService],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })

    fixture = TestBed.createComponent(DetailViewCsvTemplateConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
