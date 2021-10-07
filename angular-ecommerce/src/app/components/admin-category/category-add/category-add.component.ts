import { MyCustomValidators } from './../../../validators/my-custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../../services/product.service';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Category } from './../../../common/category';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {

  addCategoryFormGroup!: FormGroup;

  errMessage = ErrMessage;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.addCategoryFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), 
                                Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace])
    })
  }

  get name() {
    return this.addCategoryFormGroup.get('name');
  }

  onSubmit() {
    if (this.addCategoryFormGroup.invalid) {
      this.addCategoryFormGroup.markAllAsTouched();
      return;
    }
    
    let category = new Category();
    category.id = 0;
    category.name = this.addCategoryFormGroup.get('name')?.value;
    category.imageUrl = 'assets/images/category/placeholder.png';
    category.isDeleted = 0;

    console.log(category);

    this.productService.addCategory(category).subscribe({
      next: response => {
        this.confirmContinute();
        this.toastr.success('Category has been public', 'Add category successfully!');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }

  confirmContinute() {
    Swal.fire({
      title: 'Continute',
      text: 'Do you want to continute add category?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(
      result => {
        if (result.value) {
          this.resetForm();
        } else {
        this.router.navigateByUrl('/admin-category');
        }
      }
    )
  }

  resetForm() {
    this.addCategoryFormGroup.reset();
  }

}
