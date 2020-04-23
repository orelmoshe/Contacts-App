import { Component, Input , OnInit , OnChanges } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { ContactInterface } from "../../../models/IContact";
import { ShareDataService } from 'src/app/services/share-data/share-data.service';
import { Router } from '@angular/router';
import _ from 'lodash';

@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.scss"]
})

export class ItemListComponent implements OnInit , OnChanges {

  @Input() filterValue: string;

  public displayedColumns: string[] = ["select", "picture", "name", "telephone" ,"isActive", 'edit'];
  public dataSource: MatTableDataSource<ContactInterface>;
  public selection = new SelectionModel<ContactInterface>(true, []);
  private contactList: ContactInterface[] = [];

  public constructor(private shareDataService: ShareDataService , private router: Router) {}

  public ngOnInit(): void {
     this.getAllContacts();
  }

  private getAllContacts(): void {
    this.shareDataService.getContactsObservable().subscribe(contacts  => {
      this.contactList = contacts ;
      this.dataSource = new MatTableDataSource<ContactInterface>(this.contactList);
    });
  }

  public ngOnChanges(): void {
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue;
    } else {
      this.dataSource = new MatTableDataSource<ContactInterface>(this.contactList);
    }
  }

  public selectContacts(event,row) : void {
    event.stopPropagation();
    if(this.isExist(row.id)){
       _.remove(this.shareDataService.garbageList,(item:ContactInterface) => item.id === row.id);
    } else {
      this.shareDataService.garbageList.push(row);
    }
  }

  public isExist(id: number) : boolean{
    return _.some(this.shareDataService.garbageList, {id});
  }

  public selectAllContacts() : void {
    if(this.isAllSelected()){
      this.shareDataService.garbageList = [];
   } else {
     this.shareDataService.garbageList = this.contactList;
   }
  }

  public editClick(contact) : void{
    this.router.navigate(['/edit',contact]);
  }

  public isAllSelected() : boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() : void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public checkboxLabel(row?: ContactInterface) : string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.id + 1}`;
  }

}
