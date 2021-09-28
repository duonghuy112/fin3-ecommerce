package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
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
	public List<ReviewDto> findByProductId(Long productId, Integer isDeleted) {
		return reviewRepository.findByProductIdAndIsDeleted(productId, isDeleted)
								.stream()
								.map(ReviewDto::new).collect(Collectors.toList());
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
	
	private void convert(Review review, ReviewDto reviewResponse) {
		review.setId(reviewResponse.getId());
		review.setContent(reviewResponse.getContent());
		review.setProduct(productRepository.getById(reviewResponse.getProductId()));
		review.setCustomer(customerRepository.findByEmail(reviewResponse.getCustomer().getEmail()));
		review.setIsDeleted(reviewResponse.getIsDeleted());
	}
}
