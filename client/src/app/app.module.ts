import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";

import { AppComponent } from "./app.component";
import { ContactsComponent } from "./components/contacts/contacts.component";
import { HeaderComponent } from "./components/contacts/header/header.component";
import { ItemListComponent } from "./components/contacts/item-list/item-list.component";
import { AddComponent } from "./components/add/add.component";
import { AlertDialogComponent } from "./components/widgets/alert-dialog/alert-dialog.component";
import { ShareDataService } from './services/share-data/share-data.service';
import { HttpService } from './services/http/http.service';

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent,
    HeaderComponent,
    ItemListComponent,
    AddComponent,
    AlertDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],
  providers: [ShareDataService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule {}
