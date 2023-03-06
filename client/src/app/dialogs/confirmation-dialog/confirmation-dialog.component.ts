import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {TranslateItPipe} from "../../shared/pipes/translate-it.pipe";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  providers: [TranslateItPipe]
})

export class ConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public translateIt: TranslateItPipe,
    @Inject(MAT_DIALOG_DATA) public message: string) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
