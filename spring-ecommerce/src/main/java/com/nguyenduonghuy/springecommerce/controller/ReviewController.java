package com.nguyenduonghuy.springecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduonghuy.springecommerce.dto.ReviewResponse;
import com.nguyenduonghuy.springecommerce.service.ReviewService;

@RestController
@RequestMapping("api/reviews")
public class ReviewController {

	@Autowired
	private ReviewService reviewService;
	
	@GetMapping
	public List<ReviewResponse> getAll() {
		return reviewService.finAll();
	}
	
	@GetMapping("/search/findByProductId")
	public List<ReviewResponse> get(@RequestParam("productId") Long productId) {
		return reviewService.findByProductId(productId);
	}
	
	@PostMapping
	public ReviewResponse add(@RequestBody ReviewResponse reviewResponse) {
		return reviewService.save(reviewResponse);
	}
	
	@PutMapping
	public ReviewResponse update(@RequestBody ReviewResponse reviewResponse) {
		return reviewService.save(reviewResponse);
	}
}
