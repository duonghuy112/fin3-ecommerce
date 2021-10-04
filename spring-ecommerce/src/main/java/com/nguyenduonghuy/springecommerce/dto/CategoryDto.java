package com.nguyenduonghuy.springecommerce.dto;

import com.nguyenduonghuy.springecommerce.entity.Category;

import lombok.Data;

@Data
public class CategoryDto {
	private Long id;
	private String name;
	private Integer isDeleted;
	
	public CategoryDto(Category category) {
		this.id = category.getId();
		this.name = category.getName();
		this.isDeleted = category.getIsDeleted();
	}
}
