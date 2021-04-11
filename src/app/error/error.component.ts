import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

  @Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
  })


export class errorComponent {
  constructor(public dialogRef: MatDialogRef<errorComponent>,@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
