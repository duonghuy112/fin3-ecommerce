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

import com.nguyenduonghuy.springecommerce.dto.ProductDto;
import com.nguyenduonghuy.springecommerce.service.ProductService;

@RestController
@RequestMapping("api/products")
public class ProductController {

	@Autowired
	private ProductService productService;
	
	@GetMapping
	public ResponseEntity<Page<ProductDto>> getAll(@RequestParam int isDeleted,
												   @RequestParam int page,
												   @RequestParam int size,
												   @RequestParam String sort,
												   Pageable pageable) {
		return new ResponseEntity<>(productService.findByIsDeleted(isDeleted, page, size, sort, pageable), 
									HttpStatus.OK);
	}
	
	@GetMapping("/findByCategoryId")
	public ResponseEntity<Page<ProductDto>> getByCategory(@RequestParam Long categoryId,
													     @RequestParam int isDeleted,
													     @RequestParam int page,
													     @RequestParam int size,
													     @RequestParam String sort,
													     Pageable pageable) {
		return new ResponseEntity<>(productService.findByCategoryIdAndIsDeleted(categoryId, isDeleted, page, size, sort, pageable), 
									HttpStatus.OK);
	}
	
	@GetMapping("/findByNameContaining")
	public ResponseEntity<Page<ProductDto>> getByName(@RequestParam String productName,
													 @RequestParam int isDeleted,
												     @RequestParam int page,
												     @RequestParam int size,
												     @RequestParam String sort,
												     Pageable pageable) {
		return new ResponseEntity<>(productService.findByNameContainingAndIsDeleted(productName, isDeleted, page, size, sort, pageable), 
									HttpStatus.OK);
	}
}