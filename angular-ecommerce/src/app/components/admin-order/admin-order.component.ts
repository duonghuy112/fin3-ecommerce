import { Customer } from './../../common/customer';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { FormControl, Validators } from '@angular/forms';
import { OrderItem } from './../../common/order-item';
import { OrderHistory } from './../../common/order-history';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {
// order history list
orderHistoryList: OrderHistory[] = [];
status: number = -1;

// order history for sort
sortedOrder: OrderHistory[] = [];

// order item by order history
orderItems: OrderItem[] = [];

// customer by order history
customer!: Customer;
ordersByCustomer!: OrderHistory[];

// oder in modal
order!: OrderHistory;

// page
pageNumber: number = 1;
pageSize: number = 5;
totalElements: number = 0;
startElement: number = 0;
endElement: number = 0;
inputPage = new FormControl();

// search
search = new FormControl();
orderNumber: string = '';

constructor(private orderHistoryService: OrderHistoryService,
            private router: Router,
            private toastr: ToastrService) {
  this.sortedOrder = this.orderHistoryList.slice();
}

ngOnInit(): void {
  this.listOrderHistory();
}

listOrderHistory() {
  if (this.orderNumber !== '') {
    this.handleOrderByOrderTrackingNumber(this.orderNumber);
  }else if (this.status === -1) {
   this.handleAllOrder();
 } else {
   this.handleOrderByStatus(this.status);
 }
}

handleAllOrder() {
  // retrieve data from service
  this.orderHistoryService.getAllOrderHistory(this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
}

handleOrderByStatus(status: number) {
  this.orderHistoryService.getOrderHistoryByStatus(status, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
}

handleOrderByOrderTrackingNumber(orderTrackingNumber: string) {
  this.orderHistoryService.getOrderHistoryByOrderTrackingNumber(orderTrackingNumber, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
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
      case 'customer': return this.compare(a.customer.firstName, b.customer.firstName, isAsc);
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

openCustomer(customer: Customer) {
  this.customer = customer;
  console.log('customer ' + JSON.stringify(this.customer));
  this.orderHistoryService.getOrderHistoryByEmail(this.customer.email, 0, 100).subscribe(
    data => {
      this.ordersByCustomer = data.content;
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
  console.log(this.order);
}

processOrder(order: OrderHistory) {
  order.status = 2;
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

statusAll() {
  this.status = -1;
  this.reset();
  this.listOrderHistory();
}

statusCancel() {
  this.status = 0;
  this.reset();
  this.listOrderHistory();
}

statusPending() {
  this.reset();
  this.status = 1;
  this.listOrderHistory();
}

statusProcess() {
  this.reset();
  this.status = 2;
  this.listOrderHistory();
}

statusComplete() {
  this.status = 3;
  this.reset();
  this.listOrderHistory();
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
      this.orderNumber = value;
      this.handleOrderByOrderTrackingNumber(this.orderNumber)
    }
  )
}

reset() {
  this.search.setValue('');
}

}
