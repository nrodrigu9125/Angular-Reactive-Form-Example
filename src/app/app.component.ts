import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  parentParts: any;
  detailsForm: FormGroup;
  partSearchForm: FormGroup;
  inventorySearchForm: FormGroup;
  departments = [
    'HR',
    'Payroll'
  ];

  webApiUrl = '';

  showBasicForm = true;
  showPartForm = false;
  isPartSearchFormEnabled = false;

  constructor(private readonly fb: FormBuilder,
              private readonly httpClient: HttpClient) {

    this.detailsForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleInitial: ['', Validators.maxLength(1)],
      position: ['Sales', Validators.minLength(3)],
      department: [''],
      immediateSupervisor: [''],
      phoneNumber: ['', Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)],
      email: ['', [Validators.email, Validators.required]],
    });

    this.inventorySearchForm = fb.group({
      organizationId: ['1013', Validators.required],
      partNumber: ['131100030-', Validators.required]
    });

    // 1364454
    this.partSearchForm = fb.group({
      organizationId: [{value: '', disabled: !this.isPartSearchFormEnabled }, Validators.required],
      inventoryItemId: [{value: '', disabled: !this.isPartSearchFormEnabled }, Validators.required]
    });
  }

  saveEmployeeDetails(): void {
    console.log('Form Submitted', this.detailsForm.value);
  }

  searchForInventoryItemId(): void {
    const organizationId = this.inventorySearchForm.controls.organizationId.value;
    const partNumber = this.inventorySearchForm.controls.partNumber.value;

    this.httpClient.get<any>(this.webApiUrl + `${organizationId}/${partNumber}`)
    .subscribe(
      data => {
        this.isPartSearchFormEnabled = true;

        this.partSearchForm.get('organizationId').enable();
        this.partSearchForm.get('inventoryItemId').enable();

        this.partSearchForm.patchValue({organizationId: organizationId});
        this.partSearchForm.patchValue({inventoryItemId: data});
      },
      (error => {alert(`There was an error getting the inventory item id: ${error.error.Message}`); console.log(error);})
    );
  }

  searchForPartNumber(): void {
    const organizationId = this.partSearchForm.controls.organizationId.value;
    const inventoryItemId = this.partSearchForm.controls.inventoryItemId.value;

    this.httpClient.get<any>(this.webApiUrl + `/PartInfo/GetParentPartsInformation/${organizationId}/${inventoryItemId}`)
    .subscribe(
      data => this.parentParts = data,
      (error => alert(`There was an error getting the parent parts information: ${error}`))
    );
  }

  logTheForm(): void {
    if (this.showBasicForm) {
      console.log('form: ', this.detailsForm);
    }

    if (this.showPartForm) {
      console.log('partSearchForm: ', this.partSearchForm);
      console.log('inventorySearchForm: ', this.inventorySearchForm);
    }
  }

  onShowBasicForm() {
    this.showBasicForm = true;
    this.showPartForm = false;
  }

  onShowPartForm()  {
    this.showBasicForm = false;
    this.showPartForm = true;
  }
}
