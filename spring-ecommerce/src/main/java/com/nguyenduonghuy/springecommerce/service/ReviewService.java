package com.nguyenduonghuy.springecommerce.service;

import java.util.List;

import com.nguyenduonghuy.springecommerce.dto.ReviewDto;

public interface ReviewService {
	
	List<ReviewDto> finAll();
	
	List<ReviewDto> findByProductId(Long productId);
	
	ReviewDto get(Long id);
	
	ReviewDto save(ReviewDto reviewResponse);
}
