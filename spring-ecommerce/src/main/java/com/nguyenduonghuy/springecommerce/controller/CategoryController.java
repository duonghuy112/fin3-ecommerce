package com.nguyenduonghuy.springecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduonghuy.springecommerce.dto.CategoryDto;
import com.nguyenduonghuy.springecommerce.service.CategoryService;

@RestController
@RequestMapping("api/category")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;
	
	@GetMapping
	public ResponseEntity<Page<CategoryDto>> getAll(@RequestParam Integer isDeleted,
													@RequestParam int page,
													@RequestParam int size,
													Pageable pageable) {
		return new ResponseEntity<>(categoryService.findByIsDeleted(isDeleted, page, size, pageable),
									HttpStatus.OK);
	}
}
