import { Product } from './../../common/product';
import { FileService } from './../../services/file.service';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { Sort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../services/product.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Category } from './../../common/category';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  // form group
  addCategoryFormGroup!: FormGroup;

  // category list
  categoryList: Category[] = [];
  sortCategory: Category[] = [];
  productListByCategory: Product[] = [];
  detailCategory!: Category;
  deleteCategory!: Category;
  
  // page
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;
  inputPage = new FormControl();

  // search
  search = new FormControl();
  searchName: string = '';

  // message
  errMessage = ErrMessage;

  filename!: string;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private fileService: FileService,
              private toastr: ToastrService, 
              private router: Router) {
    this.sortCategory = this.categoryList.slice();
  }

  ngOnInit(): void {

    this.addCategoryFormGroup = this.formBuilder.group({
      categoryName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                        Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace])
    })

    this.listCategory();
  }

  get categoryName() {
    return this.addCategoryFormGroup.get('categoryName');
  }

  listCategory() {
    if (this.searchName !== '') {
      this.handleListCategoryByName(this.searchName);
    } else {
      this.handleListAllCategory();
    }
  }

  handleListAllCategory() {
    this.productService.getCategories(this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  handleListCategoryByName(name: string) {
    this.productService.getCategoriesByName(name, this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  processResult() {
    return data => {
        this.categoryList = data.content;
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
        this.endElement = this.startElement + this.pageSize - 1;
        if (this.endElement > this.totalElements) {
          this.endElement = this.totalElements
        }
        console.log(this.categoryList);
    };
  }

  onAddCategorySubmit() {
    if (this.addCategoryFormGroup.invalid) {
      this.addCategoryFormGroup.markAllAsTouched();
      return;
    }

    let category = new Category();
    category.id = 0;
    category.name = this.addCategoryFormGroup.get('categoryName')?.value;
    category.isDeleted = 0;
    category.imageUrl = `assets/images/category/${this.filename}`;

    console.log(category);

    document.getElementById('add-close-form')?.click();

    this.productService.addNewCategory(category).subscribe({
      next: response => {
        this.toastr.success('Your review has been public', 'Submit review successfully!');
        this.resetForm();
        this.listCategory();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    })
  }

  openCategoryDetail(category: Category) {
    this.detailCategory = category;
    this.productService.getProductListByCategoryPaginate(this.detailCategory.id, 0, 100, 'id').subscribe(
      data => {
        this.productListByCategory = data.content;
      }
    )
  }

  openDeleteCategory(category: Category) {
    this.deleteCategory = category;
    Swal.fire({
      title: 'Delete Category',
      text: 'Do you want to delete category?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(
      result => {
        if (result.value) {
          this.removeCategory();
        } 
      }
    )
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listCategory();
  }

  sortData(sort: Sort) {
    const data = this.categoryList.slice();
    if(!sort.active || sort.direction === '') {
      this.sortCategory = data;
      return;
    }

    this.sortCategory = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        default: return 0;
      }
    });
    this.categoryList = this.sortCategory;
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
        this.handleListCategoryByName(this.searchName);
      }
    )
  }

  reset() {
    this.search.setValue('');
  }

  resetForm() {
    this.addCategoryFormGroup.reset();
  }

  removeCategory() {
    this.productService.countProduct(this.deleteCategory.id).subscribe(
      data => {
        if (data > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Cannot delete...',
            text: 'Because category has some product!',
          })
        } else {
          this.productService.getCategory(this.deleteCategory.id).subscribe(
            data => {
              if (data === null) {
                // category has been deleted
                Swal.fire({
                  title: 'Category has been deleted!',
                  text: 'Do you want to reload page?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, reload page!',
                  cancelButtonText: 'No, keep it'
                }).then(
                  result => {
                    if (result.value) {
                      this.listCategory();
                    }
                  }
                )
              } else if (JSON.stringify(this.deleteCategory) === JSON.stringify(data)) {
                // review can delete
                this.deleteCategory.isDeleted = 1;
                console.log(this.deleteCategory);
                
                this.productService.updateCategory(this.deleteCategory).subscribe({
                  next: response => {
                    this.toastr.success('Category has been deleted', 'Delete category successfully!');
                    this.resetForm();
                    this.listCategory();
                  },
                  error: err => {
                    console.log(err);
                    this.toastr.error("Error response");
                    this.router.navigateByUrl('/error');
                  }
                });
              } else {
                // review has been updated
                Swal.fire({
                  title: 'Review has been updated!',
                  text: 'Do you want to reload page?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, reload page!',
                  cancelButtonText: 'No, keep it'
                }).then(
                  result => {
                    if (result.value) {
                      this.listCategory();
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  }
}
