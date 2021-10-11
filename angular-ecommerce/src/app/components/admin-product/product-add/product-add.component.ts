import { Product } from './../../../common/product';
import { MyCustomValidators } from './../../../validators/my-custom-validators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../../services/product.service';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Category } from './../../../common/category';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

  // category list
  categoryList: Category[] = [];
  categoryProduct = new Category();

  // category form
  addProductFormGroup!: FormGroup;

  // error message
  errMessage = ErrMessage;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.addProductFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)], ),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255), MyCustomValidators.badwordConstraint]),
      unitPrice: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[0-9]{1,4}'), Validators.max(1000)]),
    });
    this.getCategory();
  }

 // getter for form
  get name() {
    return this.addProductFormGroup.get('name');
  }

  get category() {
    return this.addProductFormGroup.get('category');
  }

  get description() {
    return this.addProductFormGroup.get('description');
  }

  get unitPrice() {
    return this.addProductFormGroup.get('unitPrice');
  }

  onSubmit() {
    if (this.addProductFormGroup.invalid) {
      this.addProductFormGroup.markAllAsTouched();
      return;
    }
    
    let categoryProduct = new Category();
    categoryProduct.id = this.addProductFormGroup.get('category')?.value;

    // set up product
    let product = new Product();
    product.id = 0;
    product.name = this.addProductFormGroup.get('name')?.value;
    product.category = categoryProduct;
    product.description = this.addProductFormGroup.get('description')?.value;
    product.unitPrice = this.addProductFormGroup.get('unitPrice')?.value;
    product.active = 1;
    product.isDeleted = 0;
    product.imageUrl = 'assets/images/products/placeholder.png'

    this.productService.addProduct(product).subscribe({
      next: response => {
        this.toastr.success('Product has been public', 'Add product successfully!');
        this.confirmContinute();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }

  getCategory() {
    this.productService.getCategories(0, 100).subscribe(
      data => {
        this.categoryList = data.content;
      }
    );
  }

  confirmContinute() {
    Swal.fire({
      title: 'Continute',
      text: 'Do you want to continute add product?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(
      result => {
        if (result.value) {
          this.resetForm();
        } else {
          this.router.navigateByUrl('/admin-product');
        }
      }
    )
  }

  resetForm() {
    this.addProductFormGroup.reset();
  }
  
  // tab loop circle
  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }
}
