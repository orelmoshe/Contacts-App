import { Component, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})

export class AlertDialogComponent {
  
  public message: string = "";
  public cancelButtonText: string = "Cancel";

  public constructor( @Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<AlertDialogComponent> ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
    this.dialogRef.updateSize('300vw','300vw');
  }

  public onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}