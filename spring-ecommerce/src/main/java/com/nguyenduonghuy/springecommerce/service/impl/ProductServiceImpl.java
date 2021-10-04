package com.nguyenduonghuy.springecommerce.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.ProductDto;
import com.nguyenduonghuy.springecommerce.repository.ProductRepository;
import com.nguyenduonghuy.springecommerce.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService{

	@Autowired
	private ProductRepository productRepository;
	
	@Override
	public Page<ProductDto> findByIsDeleted(int isDeleted, int page, int size, String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByIsDeleted(isDeleted, pageable)
								.map(ProductDto::new);
	}

	@Override
	public Page<ProductDto> findByCategoryIdAndIsDeleted(Long categoryId, int isDeleted, 
														 int page, int size, 
														 String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted, pageable)
								.map(ProductDto::new);
	}

	@Override
	public Page<ProductDto> findByNameContainingAndIsDeleted(String productName, int isDeleted, 
															 int page, int size, 
															 String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByNameContainingAndIsDeleted(productName, isDeleted, pageable)
								.map(ProductDto::new);
	}

	

}
