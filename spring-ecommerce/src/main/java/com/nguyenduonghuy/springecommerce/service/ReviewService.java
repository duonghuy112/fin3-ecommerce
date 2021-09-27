package com.nguyenduonghuy.springecommerce.service;

import java.util.List;

import com.nguyenduonghuy.springecommerce.dto.ReviewResponse;

public interface ReviewService {
	
	List<ReviewResponse> finAll();
	
	List<ReviewResponse> findByProductId(Long productId);
	
	ReviewResponse get(Long id);
	
	ReviewResponse save(ReviewResponse reviewResponse);
}
