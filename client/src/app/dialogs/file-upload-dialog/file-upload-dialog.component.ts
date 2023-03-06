import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Validators} from "@angular/forms";
import {RxFormGroup, RxFormBuilder} from '@rxweb/reactive-form-validators';
import {CsvImportService} from "../../_services/csv-import.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  form: RxFormGroup;
  filename: string;
  file: string|Blob;

  constructor(
    private router: Router,
    private fb: RxFormBuilder,
    private csvImportService: CsvImportService,
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * init form
   *
   * @private
   */
  private initForm(): void {
    this.form = <RxFormGroup>this.fb.group({
      file: ['', Validators.required]
    });
  }

  /**
   * on file change
   *
   * @param event
   */
  onFileChange(event: Event) {
    if (event && event.target) {
      const target = event.target as HTMLInputElement;
      if (target.files) {
        const file: File = (target.files as FileList)[0];
        if (file) {
          this.filename = file.name;
          this.file = file;
        }
      }
    }
  }

  /**
   * on cancel click
   */
  onCancelClick(): void {
    this.dialogRef.close();
    this.router.navigate(['']);
  }

  /**
   * on submit - execute on upload button click
   */
  onSubmit() {
    // console.log('file: ' + this.file);
    // console.log('form-value: ' + this.form.value);
    // console.log('form-data: ' + this.form.toFormData());

    //this.csvImportService.importCsvFile(this.file, this.filename);

    // console.log('csvImportService called...');

    this.onCancelClick();
  }
}
