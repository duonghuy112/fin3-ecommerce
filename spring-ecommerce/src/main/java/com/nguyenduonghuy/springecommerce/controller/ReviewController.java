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

import com.nguyenduonghuy.springecommerce.dto.ReviewDto;
import com.nguyenduonghuy.springecommerce.service.ReviewService;

@RestController
@RequestMapping("api/reviews")
public class ReviewController {

	@Autowired
	private ReviewService reviewService;
	
	@GetMapping
	public List<ReviewDto> getAll() {
		return reviewService.finAll();
	}
	
	@GetMapping("/search/findByProductId")
	public List<ReviewDto> get(@RequestParam("productId") Long productId) {
		return reviewService.findByProductId(productId);
	}
	
	@PostMapping
	public ReviewDto add(@RequestBody ReviewDto reviewResponse) {
		return reviewService.save(reviewResponse);
	}
	
	@PutMapping
	public ReviewDto update(@RequestBody ReviewDto reviewResponse) {
		return reviewService.save(reviewResponse);
	}
}
