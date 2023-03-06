/** reviewed by Ronny Brandt - 24.07.2021 */

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import {CsvImportService} from '../../_services/csv-import.service';
import { RxFormGroup, RxFormBuilder } from '@rxweb/reactive-form-validators';
import {Router} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {MessagesService} from "../../_services/messages.service";
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

@Component({
  selector: 'app-csv-import-dialog',
  templateUrl: './csv-import-dialog.component.html',
  styleUrls: ['./csv-import-dialog.component.css'],
  providers: [TranslateItPipe, MessageService]
})

export class CsvImportDialogComponent implements OnInit, OnDestroy {
  showSpinner = false
  form: RxFormGroup;
  filename: string;
  file: any;
  msg = ''

  csvImportTypes!: Array<{id: number, label: string}>
  csvTemplateConfigs: Array<{id: number, label: string}> = []

  subscription1: Subscription
  subscription2: Subscription

  constructor(
    private router: Router,
    private fb: RxFormBuilder,
    private csvImportService: CsvImportService,
    public dialogRef: MatDialogRef<CsvImportDialogComponent>,
    public translatePipe: TranslateItPipe,

    // private messageService: MessageService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: string) {
      this.messagesService.setTranslatePipe(translatePipe);
      this.csvImportService.setTranslatePipe(translatePipe);
    }

  ngOnInit() {
    // get csv import types form DB
    this.subscription1 = this.csvImportService.getCsvTypes().subscribe((res: Array<{id: number, label: string}> | false)=>{
      if(res) this.csvImportTypes =  res
      else{
        this.csvImportTypes = []
        this.messagesService.showErrorMessage('Something wrong on backend side | getCsvTypes', true)
      }
    })

    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      file: ['', Validators.required],
      csv_type: [null, Validators.required],
      csv_template: new FormControl({value: null, disabled: true}, Validators.required)
    }) as RxFormGroup;
  }

  //// rev: argument should be typed. I can see it is an event(..emitter), but it requires me to look at the html
  onCsvTypeChange(value): void{
    //// rev: value is an event, i don't see a reason why this if statement could not be removed
    if(value !== ''){
      // get template configs form DB
      this.subscription2 = this.csvImportService.getTemplateConfigs(+value).subscribe((res: Array<{id: number, label: string}> | false) =>{
        //// rev: if statement should be minimized, also: do we really need an if here?
        if(res !== false){
          this.csvTemplateConfigs = res
          this.form.controls.csv_template.enable()
        }else {
          this.csvTemplateConfigs = []
          this.messagesService.showErrorMessage('Something wrong on backend side | getTemplateCofig', true)
        }
      })
    }
    else{
      this.form.controls.csv_template.setValue(null)
      this.form.controls.csv_template.disable()
    }
  }

  onFileChange(event) {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (file) this.file = file
  }

  onCancelClick(): void {
    this.dialogRef.close();
    this.router.navigate(['']);
  }

  /* execute on upload button click */
  onSubmit() {
    this.showSpinner = true

    const params = {
      template: this.form.controls.csv_template.value,
      file: this.file
    }

    this.csvImportService.importCsvFile(params).then(()=>{
      this.showSpinner = false
      this.onCancelClick();
    });
  }

  ngOnDestroy () {
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
  }
}
