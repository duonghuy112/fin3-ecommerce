package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.ProductDto;
import com.nguyenduonghuy.springecommerce.entity.Product;
import com.nguyenduonghuy.springecommerce.repository.CategoryRepository;
import com.nguyenduonghuy.springecommerce.repository.ProductRepository;
import com.nguyenduonghuy.springecommerce.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService{

	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Override
	@Transactional
	public Page<ProductDto> findByIsDeleted(int isDeleted, int page, int size, String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByIsDeleted(isDeleted, pageable)
								.map(ProductDto::new);
	}
	
	@Override
	@Transactional
	public Page<ProductDto> findByIsDeletedDesc(int isDeleted, int page, int size, String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort).descending());
		return productRepository.findByIsDeleted(isDeleted, pageable)
								.map(ProductDto::new);
	}

	@Override
	@Transactional
	public Page<ProductDto> findByCategoryIdAndIsDeleted(Long categoryId, int isDeleted, 
														 int page, int size, 
														 String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted, pageable)
								.map(ProductDto::new);
	}

	@Override
	@Transactional
	public Page<ProductDto> findByNameContainingAndIsDeleted(String productName, int isDeleted, 
															 int page, int size, 
															 String sort, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by(sort));
		return productRepository.findByNameContainingAndIsDeleted(productName, isDeleted, pageable)
								.map(ProductDto::new);
	}
	
	@Override
	@Transactional
	public ProductDto findById(Long id, Integer isDeleted) {
		ProductDto productDto = null;
		if (productRepository.findByIdAndIsDeleted(id, isDeleted) != null) {
			productDto = new ProductDto(productRepository.findByIdAndIsDeleted(id, isDeleted));
		}
		return productDto;
	}
	
	@Override
	@Transactional
	public ProductDto save(ProductDto productDto) {
		Optional<Product> optional = productRepository.findById(productDto.getId());
		Product product = new Product();
		if (optional.isPresent()) {
			product = optional.get();
		}
		convert(product, productDto);
		productRepository.save(product);
		return productDto;
	}

	@Override
	@Transactional
	public Integer countProductByCategory(Long categoryId, Integer isDeleted) {
		int count = 0;
		if (productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted) != null) {
			count = productRepository.findByCategoryIdAndIsDeleted(categoryId, isDeleted).size();
		}
		return Integer.valueOf(count);
	}
	
	private void convert(Product product, ProductDto productDto) {
		product.setId(productDto.getId());
		product.setName(productDto.getName());
		product.setDescription(productDto.getDescription());
		product.setUnitPrice(productDto.getUnitPrice());
		product.setImageUrl(productDto.getImageUrl());
		product.setActive(productDto.getActive());
		product.setDateCreated(product.getDateCreated());
		product.setLastUpdated(product.getLastUpdated());
		product.setIsDeleted(productDto.getIsDeleted());
		product.setCategory(categoryRepository.getById(productDto.getCategory().getId()));
	}
}
