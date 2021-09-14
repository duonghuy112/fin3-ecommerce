import { ProductService } from './../../services/product.service';
import { Category } from './../../common/category';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.css']
})
export class CategoryMenuComponent implements OnInit {

  categories: Category[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listCategories();
  }

  listCategories() {
    this.productService.getCategories().subscribe(
      data => {
        console.log('Categories=' + JSON.stringify(data));
        this.categories = data;
      }
    )
  }

}
