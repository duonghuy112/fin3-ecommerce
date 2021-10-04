package com.nguyenduonghuy.springecommerce.dto;

import java.time.LocalDateTime;

import com.nguyenduonghuy.springecommerce.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
	private Long id;
	private String content;
	private Long productId;
	private CustomerDto customer;
	private LocalDateTime dateCreated;
	private LocalDateTime lastUpdated;
	private Integer isDeleted;
	private Integer star;
	
	public ReviewDto(Review review) {
		this.id = review.getId();
		this.content = review.getContent();
		this.productId = review.getProduct().getId();
		this.customer = new CustomerDto(review.getCustomer());
		this.dateCreated = review.getDateCreated();
		this.lastUpdated = review.getLastUpdated();
		this.isDeleted = review.getIsDeleted();
		this.star = review.getStar();
	}
}
