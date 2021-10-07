import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { FormControl, Validators } from '@angular/forms';
import { CustomerService } from './../../services/customer.service';
import { Customer } from './../../common/customer';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  // customer list
  userList: Customer[] = [];
  sortedUser: Customer[] = [];
  changeCustomer = new Customer();
  filter: number = 2;

  // get customer in session
  storage: Storage = sessionStorage;
  customer = new Customer();

  // page
  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;
  inputPage = new FormControl();

  // search
  search = new FormControl();
  searchName: string = '';

  constructor(private customerService: CustomerService,
              private toastr: ToastrService, 
              private router: Router) {
    this.sortedUser = this.userList.slice();
   }

  ngOnInit(): void {
    this.customer = JSON.parse(this.storage.getItem('customer') as string);
    
    this.listCustomer();
  }

  listCustomer() {
    if (this.searchName !== '') {
      this.handleListUserByName(this.searchName);
    } else if (this.filter === 2) {
      this.handleListAllUser();
    } else {
      this.handleListUserByFilter(this.filter);
    }
  }

  handleListAllUser() {
    this.customerService.getAll(this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
    console.log(this.userList);
  }

  handleListUserByFilter(isAdmin: number) {
    this.customerService.getByAdmin(isAdmin, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  handleListUserByName(name: string) {
    this.customerService.getByName(name, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  openChangeModal(customer: Customer) {
    this.changeCustomer = customer;
  }

  setAdmin() {
    this.changeCustomer.isAdmin = 1;
    this.customerService.update(this.changeCustomer).subscribe({
      next: response => {
        this.toastr.success('Your setting has been updated', 'Update user successfully!');
        this.listCustomer();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  setCustomer() {
    this.changeCustomer.isAdmin = 0;
    this.customerService.update(this.changeCustomer).subscribe({
      next: response => {
        this.toastr.success('Your profile has been updated', 'Update profile successfully!');
        this.listCustomer();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  setActivate() {
    this.changeCustomer.isActivate = 1;
    this.customerService.update(this.changeCustomer).subscribe({
      next: response => {
        this.toastr.success('Your profile has been updated', 'Update profile successfully!');
        this.listCustomer();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  setBan() {
    this.changeCustomer.isActivate = 0;
    this.customerService.update(this.changeCustomer).subscribe({
      next: response => {
        this.toastr.success('Your profile has been updated', 'Update profile successfully!');
        this.listCustomer();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  filterAll() {
    this.filter = 2;
    this.reset();
    this.listCustomer(); 
  }

  filterByAdmin() {
    this.filter = 1;
    this.reset();
    this.listCustomer();
  }

  filterByCustomer() {
    this.filter = 0;
    this.reset();
    this.listCustomer();
  }

  processResult() {
    return data => {
        this.userList = data.content;
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
        this.endElement = this.startElement + this.pageSize - 1;
        if (this.endElement > this.totalElements) {
          this.endElement = this.totalElements
        }
        console.log(this.userList);
    };
  }
  
  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listCustomer();
  }

  sortData(sort: Sort) {
    const data = this.userList.slice();
    if(!sort.active || sort.direction === '') {
      this.sortedUser = data;
      return;
    }

    this.sortedUser = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'dateCreated': return this.compare(a.dateCreated, b.dateCreated, isAsc);
        case 'role': return this.compare(a.isAdmin, b.isAdmin, isAsc);
        case 'status': return this.compare(a.isActivate, b.isActivate, isAsc);
        default: return 0;
      }
    });
    this.userList = this.sortedUser;
  }

  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  goToPage() {
    this.inputPage.setValidators([Validators.pattern('[0-9]{1,2}'), Validators.min(1), Validators.max(this.totalElements / this.pageSize + 1)]);
    
    if(this.inputPage.invalid) {
      this.inputPage.setValue(1);
      return;
    }

    this.inputPage.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(
      value => {
        this.pageNumber = value;
      }
    )
  }

  doSearch() {
    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      value => {
        console.log(value);
        this.searchName = value;
        this.handleListUserByName(this.searchName);
      }
    )
  }

  reset() {
    this.search.setValue('');
  }

}
