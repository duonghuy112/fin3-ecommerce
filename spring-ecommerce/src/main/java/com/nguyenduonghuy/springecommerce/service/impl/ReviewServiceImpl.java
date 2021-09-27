package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.List;
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
	public List<ReviewDto> finAll() {
		return reviewRepository.findAll().stream()
										.map(ReviewDto::new)
										.collect(Collectors.toList());
	}
	
	@Override
	@Transactional
	public List<ReviewDto> findByProductId(Long productId) {
		return reviewRepository.findByProductId(productId)
								.stream()
								.map(ReviewDto::new)
								.collect(Collectors.toList());
	}
	
	@Override
	public ReviewDto get(Long id) {
		return new ReviewDto(reviewRepository.findById(id).get());
	}

	@Override
	@Transactional
	public ReviewDto save(ReviewDto reviewResponse) {
		Review review = new Review();
		review.setContent(reviewResponse.getContent());
		review.setProduct(productRepository.getById(reviewResponse.getProductId()));
		review.setCustomer(customerRepository.findByEmail(reviewResponse.getCustomer().getEmail()));
		review.setIsDeleted(reviewResponse.getIsDeleted());
		reviewRepository.save(review);
		return reviewResponse;
	}

	

}
