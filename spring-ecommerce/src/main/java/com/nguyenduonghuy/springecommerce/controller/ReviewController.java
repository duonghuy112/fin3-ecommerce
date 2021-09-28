package com.nguyenduonghuy.springecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
	
	@GetMapping("/findByProductId")
	public List<ReviewDto> getByProductId(@RequestParam("productId") Long productId,
										  @RequestParam("isDeleted") Integer isDeleted) {
		return reviewService.findByProductId(productId, isDeleted);
	}
	
	@PostMapping
	public ReviewDto add(@RequestBody ReviewDto reviewResponse) {
		reviewResponse.setId(0L);
		return reviewService.save(reviewResponse);
	}
	
	@PutMapping("/{reviewId}")
	public ReviewDto update(@RequestBody ReviewDto reviewResponse, @PathVariable("reviewId") Long id) {
		return reviewService.save(reviewResponse);
	}
}
