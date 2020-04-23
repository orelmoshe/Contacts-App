import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ContactInterface } from "../../models/IContact";

@Injectable({
  providedIn: "root"
})
export class ShareDataService {
  public garbageList: ContactInterface[] = [];
  private contactsSubject: Subject<ContactInterface[]> = new Subject<ContactInterface[]>();
  private contactsObservable: Observable<ContactInterface[]>;

  public constructor() {
    this.contactsObservable = this.contactsSubject.asObservable();
  }

  public getContactsObservable(): Observable<ContactInterface[]> {
    return this.contactsObservable;
  }

  public setContactList(contactsList: ContactInterface[]) {
    this.contactsSubject.next(contactsList);
  }

}
