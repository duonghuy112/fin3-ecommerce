import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileService } from './../../services/file.service';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomerService } from './../../services/customer.service';
import { Customer } from './../../common/customer';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

  profileFormGroup!: FormGroup;

  customer = new Customer();

  storage: Storage = sessionStorage;

  errMessage = ErrMessage;

  // file
  filename!: string;

  constructor(private formBuilder: FormBuilder,
              private customerService: CustomerService,
              private fileService: FileService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.customer = JSON.parse(this.storage.getItem('customer') as string);

    console.log('customer' + JSON.stringify(JSON.parse(this.storage.getItem('customer') as string)));

    let firstName: string = '';
    let lastName: string = '';

    if (this.customer !== null) {
      firstName = (JSON.parse(this.storage.getItem('customer') as string) as Customer).firstName;
      lastName = (JSON.parse(this.storage.getItem('customer') as string) as Customer).lastName;
    }

    this.profileFormGroup = this.formBuilder.group({
      firstName: new FormControl(firstName, [Validators.required, 
                                      Validators.minLength(2),
                                      Validators.maxLength(255), 
                                      MyCustomValidators.notOnlyWhitespace]),
      lastName: new FormControl(lastName, [Validators.required, 
                                    Validators.minLength(2),
                                    Validators.maxLength(255),
                                    MyCustomValidators.notOnlyWhitespace]),
      email: new FormControl(JSON.parse(this.storage.getItem('userEmail') as string), [Validators.required,
                                    Validators.maxLength(255), 
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });

  }

  get firstName() {
    return this.profileFormGroup.get('firstName');
  }

  get lastName() {
    return this.profileFormGroup.get('lastName');
  }

  get email() {
    return this.profileFormGroup.get('email');
  }

  getCustomer() {
    this.customerService.getCustomer(JSON.parse(this.storage.getItem('customer') as string).email).subscribe(
      data => {
        this.customer = data;
      }
    );
  }

  onSubmit() {
    if (this.profileFormGroup.invalid) {
      this.profileFormGroup.markAllAsTouched();
      return;
    }

    console.log('customer alo: ' + this.customer);

    if (this.customer === null) {
      this.addCustomer();
    } else {
      this.updateProfile();
    }
  }

  // define a function to upload files
  onUploadFiles(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name); 

    this.filename = file.name;
    console.log('file' +this.filename);

    this.customer.avatar = `assets/images/customer/${this.filename}`;

    this.updateProfile();

    this.fileService.upload(formData).subscribe(
      data => {}
    );
  }

  addCustomer() {
    let newCustomer = new Customer();
    newCustomer.id = 0;
    newCustomer.firstName = this.profileFormGroup.get('firstName')?.value;
    newCustomer.lastName = this.profileFormGroup.get('lastName')?.value;
    newCustomer.email = JSON.parse(this.storage.getItem('userEmail') as string);
    newCustomer.avatar = 'assets/images/customer/avatar6.png';
    newCustomer.isAdmin = 0;
    newCustomer.isActivate = 1;
    console.log('new :' + newCustomer)
    this.customerService.add(newCustomer).subscribe({
      next: response => {
        this.toastr.success('Your profile has been updated', 'Update profile successfully!');
        this.getCustomer();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  updateProfile() {
    // set up customer
    this.customer.firstName = this.profileFormGroup.get('firstName')?.value;
    this.customer.lastName = this.profileFormGroup.get('lastName')?.value;
    this.customerService.update(this.customer).subscribe({
      next: response => {
        this.toastr.success('Your profile has been updated', 'Update profile successfully!');
        this.getCustomer();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }
}
