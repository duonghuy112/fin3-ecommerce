package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.ReviewDto;

public interface ReviewService {
	
	Page<ReviewDto> findByProductId(Long productId, Integer isDeleted,Integer page, Integer size, Pageable pageable);
	
	ReviewDto save(ReviewDto reviewResponse);
}
