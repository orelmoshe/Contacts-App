import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ContactInterface } from "../../models/IContact";

@Injectable({
  providedIn: "root"
})

export class HttpService {
  
  private readonly serverURL: string = 'http://localhost:3000';

  public constructor(private httpClient: HttpClient) {}

  public getContacts() {
    return this.httpClient.get<ContactInterface[]>(`${this.serverURL}/get-contacts`,{}).toPromise();
  }
   
  public deleteContact(idList:number[]) {
    return this.httpClient.post(`${this.serverURL}/delete-contact`,{ idList }).toPromise();
  }

  public addContact(contact: ContactInterface){
   return this.httpClient.post(`${this.serverURL}/add-contact`,contact).toPromise();
  }

  public setContact(contact: ContactInterface) {
    return this.httpClient.put(`${this.serverURL}/set-contact`,contact).toPromise();
  }

}
