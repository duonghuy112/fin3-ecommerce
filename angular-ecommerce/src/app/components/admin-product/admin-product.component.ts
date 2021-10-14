import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../services/product.service';
import { FormControl, Validators } from '@angular/forms';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  // product list
  productList: Product[] = [];
  sortProduct: Product[] = [];
  detailProduct!: Product;
  updateProduct!: Product;
  deleteProduct!: Product;

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


  constructor(private productService: ProductService,
              private toastr: ToastrService, 
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.listProduct();
  }

  listProduct() {
    if (this.searchName !== '') {
      this.handleProductByName(this.searchName);
    } else {
      this.handleListAllProduct();
    }
  }

  handleListAllProduct() {
    this.productService.getProductListPaginateDesc(this.pageNumber - 1, this.pageSize, 'dateCreated').subscribe(this.processResult());
  }

  handleProductByName(name: string) {
    this.productService.searchProductsPaginate(name, this.pageNumber - 1, this.pageSize, 'dateCreated').subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.spinner.show();
      this.productList = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
      this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
      this.endElement = this.startElement + this.pageSize - 1;
      if (this.endElement > this.totalElements) {
        this.endElement = this.totalElements
      }
      console.log(`${this.startElement} to ${this.endElement}`);
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    };
  }

  seeDetailProduct(product: Product) {
    this.detailProduct = product;
  }

  openUpdateProduct(product: Product) {
    this.updateProduct = product;
    this.productService.getProductById(this.updateProduct.id).subscribe(
      data => {
        if (data === null) {
          // product has been deleted
          Swal.fire({
            title: 'Product has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        } else if (JSON.stringify(this.updateProduct) === JSON.stringify(data)) {
          // review can delete
          this.router.navigateByUrl(`/admin-product/${this.updateProduct.id}`);
        } else {
          // review has been updated
          Swal.fire({
            title: 'Product has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        }
      }
    )
  }

  openDeleteProduct(product: Product) {
    this.deleteProduct = product;
    Swal.fire({
      title: 'Delete Product',
      text: 'Do you want to delete product?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(
      result => {
        if (result.value) {
          this.removeProduct();
        } 
      }
    )
  }

  removeProduct() {
    this.productService.getProductById(this.deleteProduct.id).subscribe(
      data => {
        if (data === null) {
          // product has been deleted
          Swal.fire({
            title: 'Product has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        } else if (JSON.stringify(this.deleteProduct) === JSON.stringify(data)) {
          // product can delete
          this.deleteProduct.isDeleted = 1;
          console.log(this.deleteProduct);
          
          this.productService.updateProduct(this.deleteProduct).subscribe({
            next: response => {
              this.toastr.success('Product has been deleted', 'Delete product successfully!');
              this.listProduct();
            },
            error: err => {
              console.log(err);
              this.toastr.error("Error response");
              this.router.navigateByUrl('/error');
            }
          });
        } else {
          // product has been updated
          Swal.fire({
            title: 'Product has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        }
      }
    )
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProduct();
  }

  sortData(sort: Sort) {
    const data = this.productList.slice();
    if(!sort.active || sort.direction === '') {
      this.sortProduct = data;
      return;
    }

    this.sortProduct = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'unitPrice': return this.compare(a.unitPrice, b.unitPrice, isAsc);
        case 'active': return this.compare(a.active, b.active, isAsc);
        case 'category': return this.compare(a.category.name, b.category.name, isAsc);
        case 'dateCreated': return this.compare(a.dateCreated, b.dateCreated, isAsc);
        default: return 0;
      }
    });
    this.productList = this.sortProduct;
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
        this.handleProductByName(this.searchName);
      }
    )
  }

  reset() {
    this.search.setValue('');
  }

}
