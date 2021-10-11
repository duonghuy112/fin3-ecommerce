import { ErrMessage } from 'src/app/common/validator/err-message';
import { debounceTime, distinctUntilChanged, max } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-item';
import { ProductService } from './../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // product list  
  products: Product[] = [];

  // category
  curCategoryId: number = 1;
  preCategoryId: number = 1;
  categoryName: string = '';

  // keyword
  preKeyword: string = '';
  keyword: string = '';
  
  // sort
  sortBy: string = 'id';

  // page
  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;
  inputPage = new FormControl();

  // error message
  errMessage = ErrMessage;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private toastr: ToastrService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => { 
        this.listProduct(); 
      });
  }

  listProduct() {
    if (Boolean(this.route.snapshot.paramMap.has('keyword'))) {
      this.handleSearchProduct();
    } else if (Boolean(this.route.snapshot.paramMap.has('id'))) {
      this.handleListProductByCategory();
    } else {
      this.handleListProduct();
    }
  }

  handleListProduct() {
    this.productService.getProductListPaginate(this.pageNumber -1, this.pageSize, this.sortBy).subscribe(this.processResult());
  }

  handleListProductByCategory() {
    // check id parameter is avaiable
    if (Boolean(this.route.snapshot.paramMap.has('id'))) {
      // get Id param string. Convert string to number
      this.curCategoryId = Number(this.route.snapshot.paramMap.get('id'));

      // get name param string
      this.categoryName = String(this.route.snapshot.paramMap.get('name'));
    }

    // if categotyId have different than previous
    // then set pageNumber back to 1
    if(this.preCategoryId != this.curCategoryId) {
      this.pageNumber = 1;
    }

    this.preCategoryId = this.curCategoryId;

    console.log(`curCategoryId=${this.curCategoryId}, pageNumber=${this.pageNumber}`);

    // get product for curCategoryId
    this.productService.getProductListByCategoryPaginate(this.curCategoryId, this.pageNumber -1, this.pageSize, this.sortBy).subscribe(this.processResult());
  }

  handleSearchProduct() {
    this.keyword = String(this.route.snapshot.paramMap.get('keyword'));

    // if keyword have different than previous
    // then set pageNumber to 1
    if (this.preKeyword != this.keyword) {
      this.pageNumber = 1
    }

    this.preKeyword = this.keyword;

    console.log(`keyword=${this.keyword}, pageNumber=${this.pageNumber}`);

    this.productService.searchProductsPaginate(this.keyword, this.pageNumber -1, this.pageSize, this.sortBy).subscribe(this.processResult());
  }

  processResult() {
    return data => {
        this.products = data.content;
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
        this.endElement = this.startElement + this.pageSize - 1;
        if (this.endElement > this.totalElements) {
          this.endElement = this.totalElements
        }
        console.log(`${this.startElement} to ${this.endElement}`);
    };
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);

    const cartItem: CartItem = new CartItem(product);

    // add toastr
    this.toastr.success(`Cart has been updated!`, "Add to cart successfully");

    this.cartService.addToCart(cartItem);
  }

  sortDefault() {
    this.sortBy = 'id';
    this.listProduct();
  }

  sortName() {
    this.sortBy = 'name';
    this.listProduct();
  }

  sortUnitPrice() {
    this.sortBy = 'unitPrice';
    this.listProduct();
  }

  sortDate() {
    this.sortBy = 'dateCreated';
    this.listProduct();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProduct();
  }

  goToPage() {
     let maxPageSize = this.totalElements / this.pageSize;
     if ((this.totalElements % this.pageSize) !== 0) {
       maxPageSize += 1;
     }

    this.inputPage.setValidators([Validators.pattern('[0-9]{1,2}'), Validators.min(1), Validators.max(maxPageSize)]);
    
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
