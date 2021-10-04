package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.CategoryDto;

public interface CategoryService {

	Page<CategoryDto> findByIsDeleted(Integer isDeleted, int page, int size, Pageable pageable);
}
