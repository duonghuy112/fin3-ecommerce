package com.nguyenduonghuy.springecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.entity.Review;

@RepositoryRestResource
public interface ReviewRepository extends JpaRepository<Review, Long>{
	
	@Query(value = "from Review where product.id = ?1 and isDeleted = 0")
	List<Review> findByProductId(Long productId);
	
}
