package com.nguyenduonghuy.springecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.nguyenduonghuy.springecommerce.entity.Product;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductDto {
	private Long id;
	private CategoryDto category;
	private String name;
	private String description;
	private BigDecimal unitPrice;
	private String imageUrl;
	private Integer active;
	private LocalDateTime dateCreated;
	private LocalDateTime lastUpdated;
	private Integer isDeleted;
	
	public ProductDto(Product product) {
		this.id = product.getId();
		this.category = new CategoryDto(product.getCategory());
		this.name = product.getName();
		this.description = product.getDescription();
		this.unitPrice = product.getUnitPrice();
		this.imageUrl = product.getImageUrl();
		this.active = product.getActive();
		this.dateCreated = product.getDateCreated();
		this.lastUpdated = product.getLastUpdated();
		this.isDeleted = product.getIsDeleted();
	}
}
