package com.nguyenduonghuy.springecommerce.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.CategoryDto;
import com.nguyenduonghuy.springecommerce.repository.CategoryRepository;
import com.nguyenduonghuy.springecommerce.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{

	@Autowired
	private CategoryRepository categoryRepository;
	
	@Override
	public Page<CategoryDto> findByIsDeleted(Integer isDeleted, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size);
		return categoryRepository.findByIsDeleted(isDeleted, pageable)
							     .map(CategoryDto::new);
	}

}
