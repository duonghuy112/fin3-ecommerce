package com.nguyenduonghuy.springecommerce.dto;

import java.time.LocalDateTime;

import com.nguyenduonghuy.springecommerce.persistence.Review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
	private Long id;
	private String content;
	private Long productId;
	private CustomerResponse customer;
	private LocalDateTime dateCreated;
	
	public ReviewResponse(Review review) {
		this.id = review.getId();
		this.content = review.getContent();
		this.productId = review.getProduct().getId();
		this.customer = new CustomerResponse(review.getCustomer().getFirstName(), review.getCustomer().getLastName(), review.getCustomer().getEmail());
		this.dateCreated = review.getDateCreated();
	}
}
