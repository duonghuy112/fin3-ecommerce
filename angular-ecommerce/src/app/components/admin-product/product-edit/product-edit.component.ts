import { Category } from './../../../common/category';
import { MyCustomValidators } from './../../../validators/my-custom-validators';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { Product } from './../../../common/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileService } from './../../../services/file.service';
import { ProductService } from './../../../services/product.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  product = new Product();

  categoryList: Category[] = [];

  editProductFormGroup!: FormGroup;

  filename!: string;

  errMessage = ErrMessage;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private fileService: FileService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

    this.editProductFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), 
                                Validators.maxLength(255)]),
      category: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    Validators.maxLength(255)]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), 
                                Validators.maxLength(255), MyCustomValidators.badwordConstraint]),
      unitPrice: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255)]),
      status: new FormControl('', Validators.required)
    });

    this.getCategory();
  }

  handleProductDetails() {
    // get Id param string. convert string to number.
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe(
      data => {
        this.product = data;
        this.editProductFormGroup.patchValue({
          name: this.product.name,
          category: this.product.category.name,
          description: this.product.description,
          unitPrice: this.product.unitPrice,
          status: this.product.active
        })
      }
    )
  }

  get name() {
    return this.editProductFormGroup.get('name');
  }

  get category() {
    return this.editProductFormGroup.get('category');
  }

  get description() {
    return this.editProductFormGroup.get('description');
  }

  get unitPrice() {
    return this.editProductFormGroup.get('unitPrice');
  }

  get status() {
    return this.editProductFormGroup.get('status');
  }

  onSubmit() {
    if (this.editProductFormGroup.invalid) {
      this.editProductFormGroup.markAllAsTouched();
      return;
    }

    this.product.name = this.editProductFormGroup.get('name')?.value;
    this.product.category.name = this.editProductFormGroup.get('category')?.value;
    this.product.description = this.editProductFormGroup.get('description')?.value;
    this.product.unitPrice = this.editProductFormGroup.get('unitPrice')?.value;
    this.product.active = Number(this.editProductFormGroup.get('status')?.value);

    console.log(this.product);

    this.productService.updateProduct(this.product).subscribe({
      next: response => {
        this.toastr.success('Product has been public', 'Edit product successfully!');
        this.router.navigateByUrl('/admin-product');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }

  onUploadFiles(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name); 

    this.filename = file.name;
    console.log('file' +this.filename);

    this.product.imageUrl = `assets/images/customer/${this.filename}`;

    this.update();

    this.fileService.upload(formData).subscribe(
      data => {}
    );
  }

  update() {
    // set up category
    this.product.name = this.editProductFormGroup.get('name')?.value;
    this.productService.updateProduct(this.product).subscribe({
      next: response => {
        this.toastr.success('Product image has been updated', 'Update product successfully!');
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

}
