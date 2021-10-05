import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderItem } from './../../common/order-item';
import { OrderHistory } from './../../common/order-history';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import {Sort} from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderHistoryComponent implements OnInit {
  // order history list
  orderHistoryList: OrderHistory[] = [];
  // order history for sort
  sortedOrder: OrderHistory[] = [];

  // order item by order history
  orderItems: OrderItem[] = [];

  // oder in modal
  order!: OrderHistory;

  //storage
  storage: Storage = sessionStorage;

  // page
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;
  inputPage = new FormControl();

  constructor(private orderHistoryService: OrderHistoryService,
              private router: Router,
              private toastr: ToastrService) {
    this.sortedOrder = this.orderHistoryList.slice();
  }

  ngOnInit(): void {
    this.listOrderHistory();
  }

  listOrderHistory() {
    // read data from browser storage
    const email = JSON.parse(this.storage.getItem('userEmail') as string);

    // retrieve data from service
    this.orderHistoryService.getOrderHistoryByEmail(email, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  sortData(sort: Sort) {
    const data = this.orderHistoryList.slice();
    if(!sort.active || sort.direction === '') {
      this.sortedOrder = data;
      return;
    }

    this.sortedOrder = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'trackingNumber': return this.compare(a.orderTrackingNumber, b.orderTrackingNumber, isAsc);
        case 'address': return this.compare(a.address.country, b.address.country, isAsc);
        case 'price': return this.compare(a.totalPrice, b.totalPrice, isAsc);
        case 'quantity': return this.compare(a.totalQuantity, b.totalQuantity, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'date': return this.compare(a.dateCreated, b.dateCreated, isAsc);
        default: return 0;
      }
    });
    this.orderHistoryList = this.sortedOrder;
  }

  openOrderItem(orderHistory: OrderHistory) {
    this.orderHistoryService.getOrderItems(orderHistory.id).subscribe(
      data => {
        this.orderItems = data._embedded.orderItems;
        console.log(this.orderItems);
      }
    )
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listOrderHistory();
  }

  processResult() {
    return data => {
        this.orderHistoryList = data.content;
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
        this.endElement = this.startElement + this.pageSize - 1;
        if (this.endElement > this.totalElements) {
          this.endElement = this.totalElements
        }
        console.log(this.orderHistoryList);
    };
  }

  openOrderModal(orderHistory: OrderHistory) {
    this.order = orderHistory;
    this.orderHistoryService.getOrderHistory(this.order.id).subscribe(
      data => {
        if (data === null) {
          // review has been deleted
          document.getElementById('close-form')?.click();
          Swal.fire({
            title: 'Review has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                document.getElementById('close-form')?.click();
                this.listOrderHistory();
              } else {
                document.getElementById('close-form')?.click();
              }
            }
          )
        } else if (JSON.stringify(this.order) === JSON.stringify(data)) {
          // review can edit
            console.log(this.order);
        } else {
          // review has been updated
          document.getElementById('close-form')?.click();
          Swal.fire({
            title: 'Review has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it',
          }).then(
            result => {
              if (result.value) {
                document.getElementById('close-form')?.click();
                this.listOrderHistory();
              } else {
                document.getElementById('close-form')?.click();
              }
            }
          )
        }
      }
    )

  }

  cancelOrder(order: OrderHistory) {
    order.status = 0;
    this.orderHistoryService.updateStatusOrder(order).subscribe({
      next: response => {
        this.toastr.success('Update order status!');
        this.listOrderHistory();
      },
      error: err => {
        console.log(err);
        this.router.navigateByUrl('error');
      }
    })
  }

  reOrder(order: OrderHistory) {
    order.status = 1;
    this.orderHistoryService.updateStatusOrder(order).subscribe({
      next: response => {
        this.toastr.success('Update order status!');
        this.listOrderHistory();
      },
      error: err => {
        console.log(err);
        this.router.navigateByUrl('error');
      }
    })
  }

  completeOrder(order: OrderHistory) {
    order.status = 3;
    this.orderHistoryService.updateStatusOrder(order).subscribe({
      next: response => {
        this.toastr.success('Update order status!');
        this.listOrderHistory();
      },
      error: err => {
        console.log(err);
        this.router.navigateByUrl('error');
      }
    })
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

}
