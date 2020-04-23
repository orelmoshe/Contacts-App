import { Component , OnInit } from "@angular/core";
import { Router , ActivatedRoute} from "@angular/router";
import { HttpService } from '../../services/http/http.service';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { addPageText , errorsMessage } from '../../../common/const/text-app.const'
import { AlertDialogComponent } from '../widgets/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms' ;
import { ContactInterface } from 'src/app/models/IContact';

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})

export class AddComponent implements OnInit {

  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public visible = true; 
  public selectable = true; 
  public removable = true; 
  public addOnBlur = true;

  public title: string;
  public roles: string[] = [];
  public formData: FormGroup;
  public isEdit: boolean;
  public isError: boolean = false;

  public constructor(private router: Router, 
                     private activatedRoute: ActivatedRoute,
                     private httpService:HttpService,
                     private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const param = this.activatedRoute.snapshot.params;
    const paramIsActive = param.isActive === undefined ? false : param.isActive;
    const IsEmptyObj: boolean = Object.keys(param).length === 0 && param.constructor === Object;
    this.isEdit = IsEmptyObj ? false : true;
    this.title = param.name ? addPageText.EDIT_CONTACT :  addPageText.ADD_CONTACT;

    this.formData = new FormGroup({
      name: new FormControl(param.name ? param.name : '', Validators.required),
      telephone: new FormControl(param.telephone ? param.telephone : '',Validators.required),
      picture: new FormControl(param.picture ? param.picture : ''),
      roles: new FormControl(param.roles ? this.roles = param.roles.split(',') : this.roles),
      isActive: new FormControl(param.isActive !== 'false' ? paramIsActive : false)
    });
  }

  public checkRoleList(list: string[]): string[] {
    if(list[0] === '') {
      return [] ;
    } else {
       return list;
    }
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.roles.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  public remove(fruit: string): void {
    const index = this.roles.indexOf(fruit);

    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  public async onSubmit(): Promise<any> {
    if(this.checkValid()){
      return;
    }
    try {
      const contact: ContactInterface = {
        picture: this.formData.controls.picture.value ? this.formData.controls.picture.value : addPageText.DEFAULT_PICTURE,
        name: this.formData.controls.name.value,
        roles: this.formData.controls.roles.value,
        telephone: this.formData.controls.telephone.value,
        isActive: this.formData.controls.isActive.value
      }
      if (this.isEdit) {
        contact.id = this.activatedRoute.snapshot.params.id;
        await this.httpService.setContact(contact);
      } else{ 
        await this.httpService.addContact(contact);
      }
      this.navigatedBack();
      } catch(ex){
        this.openAlertDialog(ex.error.message);
      }
  }

  public navigatedBack(): void {
    this.router.navigate(["/"]);
  }

  public getPictureValue(): string {
    const param = this.activatedRoute.snapshot.params;
    return param.picture ? param.picture : addPageText.DEFAULT_PICTURE;
  }

  public checkValid(): boolean {
   if(this.formData.valid) {
      this.isError = false;
      return false;
   } else {
      this.isError = true;
      return true;
   }
  }

  public  massageError(): string {
    const isNameValid = this.formData.controls.name.valid;
    const isTelephoneValid = this.formData.controls.telephone.valid;
    if(!isNameValid && !isTelephoneValid){
      return errorsMessage.NAME_AND_PHONE_REQUIRED;
    } else if (!isNameValid) {
      return errorsMessage.NAME_REQUIRED;
    } else if (!isTelephoneValid) {
      return errorsMessage.PHONE_REQUIRED;
    }
    return null;
  }

  private openAlertDialog(error): void {
    this.dialog.open(AlertDialogComponent, { data: { message: error, buttonText: { cancel: 'Done' } }, });
  }
  
}
