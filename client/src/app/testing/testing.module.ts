import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastModule } from 'primeng/toast';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ConstantsService } from '../_services/constants.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {NgModule} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AngularMaterialModule } from '../angular-material.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { InputNumberModule } from "primeng/inputnumber";
import {SharedModule} from "../shared/shared.module";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ButtonModule} from "primeng/button";

@NgModule({
    declarations: [],
    imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatTabsModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        ToastModule,
        DropdownModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        FormsModule,
        MatToolbarModule,
        AngularMaterialModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatCheckboxModule,
        MatIconModule,
        MatTableModule,
        AutoCompleteModule,
        InputNumberModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        ButtonModule,
        SharedModule
    ],
    providers: [
        ConstantsService,
        ConfirmationService
    ],
    exports: [
        DropdownModule,
        ToastModule,
        MatTabsModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FormsModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
        ]
})
export class TestingModule {
}
