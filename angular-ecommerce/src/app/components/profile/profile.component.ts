import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { FileService } from './../../services/file.service';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomerService } from './../../services/customer.service';
import { Customer } from './../../common/customer';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileFormGroup!: FormGroup;

  customer = new Customer();

  storage: Storage = sessionStorage;

  errMessage = ErrMessage;

  // file
  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };

  constructor(private formBuilder: FormBuilder,
              private customerService: CustomerService,
              private fileService: FileService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCustomer();

    console.log('customer' + JSON.parse(this.storage.getItem('customer') as string));
    
    this.profileFormGroup = this.formBuilder.group({
      firstName: new FormControl((JSON.parse(this.storage.getItem('customer') as string) as Customer).firstName, [Validators.required, 
                                      Validators.minLength(2),
                                      Validators.maxLength(255), 
                                      MyCustomValidators.notOnlyWhitespace]),
      lastName: new FormControl((JSON.parse(this.storage.getItem('customer') as string) as Customer).lastName, [Validators.required, 
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
    this.customerService.getCustomer(JSON.parse(this.storage.getItem('userEmail') as string)).subscribe(
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

    // set up customer
    this.customer.firstName = this.profileFormGroup.get('firstName')?.value;
    this.customer.lastName = this.profileFormGroup.get('lastName')?.value;

    console.log(this.customer);

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

  // define a function to upload files
  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for (const file of files) { formData.append('files', file, file.name); }
    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  // define a function to download files
  onDownloadFile(filename: string): void {
    this.fileService.download(filename).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  private resportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch(httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading... ');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading... ');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.fileStatus.status = 'done';
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!, 
                  {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
          // saveAs(new Blob([httpEvent.body!], 
          //   { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}),
          //    httpEvent.headers.get('File-Name'));
        }
        this.fileStatus.status = 'done';
        break;
        default:
          console.log(httpEvent);
          break;
      
    }
  }

  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }

}
