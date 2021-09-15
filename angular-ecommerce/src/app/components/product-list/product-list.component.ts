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
  
  products: Product[] = [];

  categoryId: number = 1;
  categoryName: string = '';
  keyword: string = '';

  constructor(private productService: ProductService,
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
    } else {
      this.handleListProduct();
    }
  }

  handleListProduct() {
    // check id parameter is avaiable
    if (Boolean(this.route.snapshot.paramMap.has('id'))) {
      // get Id param string. Convert string to number
      this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

      // get name param string
      this.categoryName = String(this.route.snapshot.paramMap.get('name'));
    }

    // get product for categoryId
    this.productService.getProductList(this.categoryId).subscribe(
      data => { 
        this.products = data; 
      })
  }

  handleSearchProduct() {
    this.keyword = String(this.route.snapshot.paramMap.get('keyword'));

    this.productService.searchProducts(this.keyword).subscribe(
      data => { 
        this.products = data; 
      })
  }

}
