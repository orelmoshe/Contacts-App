import { Component, OnInit , Output, EventEmitter } from "@angular/core";
import { ContactInterface } from "../../../models/IContact";
import { ShareDataService } from 'src/app/services/share-data/share-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../widgets/alert-dialog/alert-dialog.component';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit {

  @Output() public onFilterEvent  :EventEmitter<string> = new EventEmitter<string>();
  public counterActives: number;

  public constructor( private shareDataService: ShareDataService , private dialog: MatDialog) {}
  
  public ngOnInit(): void {
    this.getContactsLength();
  }

  private getContactsLength(): void {
    this.shareDataService.getContactsObservable().subscribe((contacts: ContactInterface[]) => {
      this.counterActives = contacts.length;
    }, (ex: HttpErrorResponse) => {
      this.openAlertDialog(ex.error.message);
    });
  }

  public handleChange(event): void {
    this.onFilterEvent.emit(event.target.value);
  }

  private openAlertDialog(error): void {
    this.dialog.open(AlertDialogComponent, { data: { message: error, buttonText: { cancel: 'Done' } }, });
  }

}
