package com.nguyenduonghuy.springecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.persistence.Review;

@RepositoryRestResource
public interface ReviewRepository extends JpaRepository<Review, Long>{
	
	List<Review> findByProductId(@Param("productId") Long productId);
}
