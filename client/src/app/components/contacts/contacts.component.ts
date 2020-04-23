import { Component , OnInit } from "@angular/core";
import { ShareDataService } from "src/app/services/share-data/share-data.service";
import { ContactInterface } from "src/app/models/IContact";
import { HttpService } from "../../services/http/http.service";
import { Router } from "@angular/router";
import { AlertDialogComponent } from "../widgets/alert-dialog/alert-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { errorsMessage } from "../../../common/const/text-app.const";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"]
})
export class ContactsComponent implements OnInit {

  public searchValue: string;

  public constructor( private httpService: HttpService,
                      private shareDataService: ShareDataService,
                      private router: Router,
                      private dialog: MatDialog
  ) {}
  
  public ngOnInit(): void {
     this.setContacts();
  }

  private async setContacts() {
    try {
      const contacts: ContactInterface[] = await  this.httpService.getContacts();
      this.shareDataService.setContactList(contacts); 
    } catch (ex) {
      this.openAlertDialog(ex.error.message);
    }
  }

  public getValueFromSearch(value: string): void {
    this.searchValue = value;
  }

  public addNewContact(): void {
    this.router.navigate(["/add"]);
  }

  public async deleteContacts(): Promise<any> {
    try {
      const list = this.shareDataService.garbageList;
      if (list.length === 0) {
        this.openAlertDialog(errorsMessage.MIN_LIST_LENGTH);
      } else {
        const idList = list.map(contact => contact.id);
        await this.httpService.deleteContact(idList);
        const contacts: ContactInterface[] = await this.httpService.getContacts();
        this.shareDataService.garbageList = [];
        this.shareDataService.setContactList(contacts);        
      }
    } catch(ex) {
      this.openAlertDialog(ex.error.message);
    }
  }

  private openAlertDialog(error): void {
    this.dialog.open(AlertDialogComponent, { data: { message: error, buttonText: { cancel: "Done" } } });
  }

}
