import { ErrMessage } from 'src/app/common/validator/err-message';
import { FileService } from './../../../services/file.service';
import { MyCustomValidators } from './../../../validators/my-custom-validators';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Category } from './../../../common/category';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../../services/product.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

  category = new Category();

  // category form group
  editCategoryFormGroup!: FormGroup;

  // file image name
  filename!: string;

  //error message
  errMessage = ErrMessage;
  
  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private fileService: FileService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleCategoryDetails();
    });

    this.editCategoryFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), 
                                Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace])
    })
  }

  handleCategoryDetails() {
    // get Id param string. convert string to number.
    const categoryId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getCategory(categoryId).subscribe(
      data => {
        this.category = data;
        this.editCategoryFormGroup.patchValue({
          name: this.category.name
        })
      }
    )
  }

  // getter for name
  get name() {
    return this.editCategoryFormGroup.get('name');
  }

  onSubmit() {
    if (this.editCategoryFormGroup.invalid) {
      this.editCategoryFormGroup.markAllAsTouched();
      return;
    }
    
    this.category.name = this.editCategoryFormGroup.get('name')?.value;
    
    console.log(this.category);
    this.productService.updateCategory(this.category).subscribe({
      next: response => {
        this.toastr.success('Category has been public', 'Edit category successfully!');
        this.router.navigateByUrl('/admin-category');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }

  // for upload file
  onUploadFiles(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name); 

    this.filename = file.name;
    console.log('file' +this.filename);

    this.category.imageUrl = `assets/images/category/${this.filename}`;

    this.updateImage();

    this.fileService.upload(formData).subscribe(
      data => {}
    );
  }

  updateImage() {
    // set up category
    this.category.name = this.editCategoryFormGroup.get('name')?.value;
    this.productService.updateCategory(this.category).subscribe({
      next: response => {
        this.toastr.success('Category image has been updated', 'Update category successfully!');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  // tab loop circle
  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }
}
