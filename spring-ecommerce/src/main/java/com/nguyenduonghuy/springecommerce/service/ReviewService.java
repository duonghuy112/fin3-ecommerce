package com.nguyenduonghuy.springecommerce.service;

import java.util.List;

import com.nguyenduonghuy.springecommerce.dto.ReviewDto;

public interface ReviewService {
	
	List<ReviewDto> findByProductId(Long productId, Integer isDeleted);
	
	ReviewDto save(ReviewDto reviewResponse);
}
