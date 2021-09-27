package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.ReviewResponse;
import com.nguyenduonghuy.springecommerce.persistence.Review;
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
	public List<ReviewResponse> finAll() {
		return reviewRepository.findAll().stream()
										.map(ReviewResponse::new)
										.collect(Collectors.toList());
	}
	
	@Override
	@Transactional
	public List<ReviewResponse> findByProductId(Long productId) {
		return reviewRepository.findByProductId(productId)
								.stream()
								.map(ReviewResponse::new)
								.collect(Collectors.toList());
	}
	
	@Override
	public ReviewResponse get(Long id) {
		return new ReviewResponse(reviewRepository.findById(id).get());
	}

	@Override
	@Transactional
	public ReviewResponse save(ReviewResponse reviewResponse) {
		Review review = new Review();
		review.setContent(reviewResponse.getContent());
		review.setProduct(productRepository.getById(reviewResponse.getProductId()));
		review.setCustomer(customerRepository.findByEmail(reviewResponse.getCustomer().getEmail()));
		reviewRepository.save(review);
		return reviewResponse;
	}

	

}
