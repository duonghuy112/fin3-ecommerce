package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.ReviewDto;
import com.nguyenduonghuy.springecommerce.entity.Review;
import com.nguyenduonghuy.springecommerce.repository.CustomerRepository;
import com.nguyenduonghuy.springecommerce.repository.ProductRepository;
import com.nguyenduonghuy.springecommerce.repository.ReviewRepository;
import com.nguyenduonghuy.springecommerce.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService{

	@Autowired
	private ReviewRepository reviewRepository;
	
	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Override
	@Transactional
	public Page<ReviewDto> findByProductId(Long productId, Integer isDeleted, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size);
		return reviewRepository.findByProductIdAndIsDeleted(productId, isDeleted, pageable)
							   .map(ReviewDto::new);
	}
	
	@Override
	@Transactional
	public ReviewDto save(ReviewDto reviewResponse) {
		Optional<Review> optional = reviewRepository.findById(reviewResponse.getId());
		Review review = new Review();
		if (optional.isPresent()) {
			review = optional.get();
		}
		convert(review, reviewResponse);
		reviewRepository.save(review);
		return reviewResponse;
	}
	
	@Override
	@Transactional
	public ReviewDto findById(Long id, Integer isDeleted) {
		ReviewDto reviewDto = null;
		if (reviewRepository.findByIdAndIsDeleted(id, isDeleted) != null) {
			reviewDto = new ReviewDto(reviewRepository.findByIdAndIsDeleted(id, isDeleted));
		}
		return reviewDto;
	}
	
	@Override
	@Transactional
	public Float countStarByProducyId(Long productId) {
		Float starReview = 0f;
		if (reviewRepository.findByProductIdAndIsDeleted(productId, 0).size() > 0) {
			starReview = reviewRepository.countStarByProducyId(productId);
		}
		return starReview;
	}
	
	private void convert(Review review, ReviewDto reviewResponse) {
		review.setId(reviewResponse.getId());
		review.setContent(reviewResponse.getContent());
		review.setProduct(productRepository.getById(reviewResponse.getProductId()));
		review.setCustomer(customerRepository.findByEmail(reviewResponse.getCustomer().getEmail()));
		review.setIsDeleted(reviewResponse.getIsDeleted());
		review.setStar(reviewResponse.getStar());
	}
}
