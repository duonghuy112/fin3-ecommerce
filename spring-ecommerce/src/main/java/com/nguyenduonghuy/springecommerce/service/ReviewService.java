package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.ReviewDto;

public interface ReviewService {
	
	Page<ReviewDto> findByProductId(Long productId, Integer isDeleted, int page, int size, Pageable pageable);
	
	ReviewDto save(ReviewDto reviewResponse);
	
	ReviewDto findById(Long id, Integer isDeleted);
	
	Float countStarByProducyId(Long productId);
}
