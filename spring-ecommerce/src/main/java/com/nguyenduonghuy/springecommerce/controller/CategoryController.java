package com.nguyenduonghuy.springecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
		return new ResponseEntity<>(categoryService.findAll(isDeleted, page, size, pageable),
									HttpStatus.OK);
	}
	
	@GetMapping("/findByName")
	public ResponseEntity<Page<CategoryDto>> getAll(@RequestParam String name,
													@RequestParam Integer isDeleted,
													@RequestParam int page,
													@RequestParam int size,
													Pageable pageable) {
		return new ResponseEntity<>(categoryService.findByName(name, isDeleted, page, size, pageable),
									HttpStatus.OK);
	}
	
	@GetMapping("/findById")
	public ResponseEntity<CategoryDto> get(@RequestParam Long id,
										   @RequestParam Integer isDeleted) {
		return new ResponseEntity<>(categoryService.getById(id, isDeleted), HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<CategoryDto> add(@RequestBody CategoryDto categoryDto) {
		return new ResponseEntity<>(categoryService.save(categoryDto), HttpStatus.CREATED);
	}
	
	@PutMapping("/{categoryId}")
	public ResponseEntity<CategoryDto> update(@RequestBody CategoryDto categoryDto,
											  @PathVariable("categoryId") Long id) {
		return new ResponseEntity<>(categoryService.save(categoryDto), HttpStatus.OK);
	}
}
