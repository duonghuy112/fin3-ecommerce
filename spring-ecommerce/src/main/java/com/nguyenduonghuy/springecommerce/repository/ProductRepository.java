package com.nguyenduonghuy.springecommerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.entity.Product;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long>{

	Page<Product> findByIsDeleted(int isDeleted, Pageable pageable);
	
	Page<Product> findByCategoryIdAndIsDeleted(Long categoryId,int isDeleted, Pageable pageable);
	
	Page<Product> findByNameContainingAndIsDeleted(String productName, int isDeleted, Pageable pageable);
	
}
