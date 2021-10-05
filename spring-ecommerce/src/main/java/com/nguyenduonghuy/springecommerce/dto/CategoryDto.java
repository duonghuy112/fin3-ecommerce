package com.nguyenduonghuy.springecommerce.dto;

import java.time.LocalDateTime;

import com.nguyenduonghuy.springecommerce.entity.Category;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryDto {
	private Long id;
	private String name;
	private Integer isDeleted;
	private LocalDateTime dateCreated;
	private String imageUrl;
	
	public CategoryDto(Category category) {
		this.id = category.getId();
		this.name = category.getName();
		this.isDeleted = category.getIsDeleted();
		this.dateCreated = category.getDateCreated();
		this.imageUrl = category.getImageUrl();
	}
}
