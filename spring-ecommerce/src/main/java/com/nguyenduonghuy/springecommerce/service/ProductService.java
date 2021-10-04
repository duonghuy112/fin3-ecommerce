package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.ProductDto;

public interface ProductService {
	
	Page<ProductDto> findByIsDeleted(int isDeleted, int page, int size, String sort, Pageable pageable);
	
	Page<ProductDto> findByCategoryIdAndIsDeleted(Long categoryId, int isDeleted, int page, int size, String sort, Pageable pageable);
	
	Page<ProductDto> findByNameContainingAndIsDeleted(String productName, int isDeleted, int page, int size, String sort, Pageable pageable);
}
