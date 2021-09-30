package com.nguyenduonghuy.springecommerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.entity.Review;

@RepositoryRestResource
public interface ReviewRepository extends JpaRepository<Review, Long>{
	
	Page<Review> findByProductIdAndIsDeleted(Long productId, Integer isDeleted, Pageable pageable);
}
