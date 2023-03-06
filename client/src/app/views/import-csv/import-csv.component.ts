import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { CsvImportDialogComponent } from 'src/app/dialogs/csv-import-dialog/csv-import-dialog.component';
import {TableDataService} from '../../_services/table-data.service';
import {TranslateItPipe} from '../../shared/pipes/translate-it.pipe';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css'],
  providers: [ TranslateItPipe ]
})
export class ImportCsvComponent implements OnInit {

  constructor(
    public matDialog: MatDialog,
    public soasPipe: TranslateItPipe,
    private csvImportService: TableDataService
  ) {}

  ngOnInit() {
    this.csvImportClick();
  }

  csvImportClick() {
    const self = this;
    this.csvImportService.removeAllTableLocks(true, '','');
      const dialogConfig = new MatDialogConfig();

      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = 'table-dialog';
      dialogConfig.width = '600px';
      dialogConfig.height = 'max-width';
      dialogConfig.data = {
        name: 'csvImport',
        title: self.soasPipe.transform('CSV_UPLOAD'),
        description: self.soasPipe.transform('CSV_IMPORT_DESCRIPTION'),
        actionButtonText: 'OK',
        message: 'CSV-Import',
        data: 'csvimport'
      };

      const modalDialog = self.matDialog.open(CsvImportDialogComponent, dialogConfig);
  }
}
