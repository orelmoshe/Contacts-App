import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AddComponent } from './components/add/add.component';


const routes: Routes = [
  { path: "", component: ContactsComponent },
  { path: "add", component: AddComponent },
  { path: "edit", component: AddComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
