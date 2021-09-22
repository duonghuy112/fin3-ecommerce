import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-item';
import { ProductService } from './../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // product list  
  products: Product[] = [];
  cartProduct: Product = null!;

  // category
  curCategoryId: number = 1;
  preCategoryId: number = 1;
  categoryName: string = '';

  // keyword
  preKeyword: string = '';
  keyword: string = '';
  
  // page
  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => { 
        this.listProduct(); 
      })
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
    this.productService.getProductListPaginate(this.pageNumber -1,
                                               this.pageSize).subscribe(this.processResult());
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
    this.productService.getProductListByCategoryPaginate(this.pageNumber -1,
                                                this.pageSize,
                                                this.curCategoryId).subscribe(this.processResult());
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

    this.productService.searchProductsPaginate(this.pageNumber -1,
                                              this.pageSize,
                                              this.keyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProduct();
  }

  processResult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
      this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
      this.endElement = this.startElement + this.pageSize - 1;
      if (this.endElement > this.totalElements) {
        this.endElement = this.totalElements
      }
      console.log(`${this.startElement} and ${this.endElement}`);
    };
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);

    const cartItem: CartItem = new CartItem(product);

    this.cartProduct = product;
    this.cartService.addToCart(cartItem);
  }

}
