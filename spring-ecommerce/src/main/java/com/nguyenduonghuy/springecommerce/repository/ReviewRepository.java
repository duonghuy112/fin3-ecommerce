package com.nguyenduonghuy.springecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.entity.Review;

@RepositoryRestResource
public interface ReviewRepository extends JpaRepository<Review, Long>{
	
	List<Review> findByProductIdAndIsDeleted(Long productId, Integer isDeleted);
	
	Page<Review> findByProductIdAndIsDeleted(Long productId, Integer isDeleted, Pageable pageable);
	
	Review findByIdAndIsDeleted(Long id, Integer isDeleted);
	
	@Query(value = "SELECT ROUND(AVG(star), 1) FROM review WHERE product_id = ?1 and is_deleted = 0",
		   nativeQuery = true)
	Float countStarByProducyId(Long productId);
}
