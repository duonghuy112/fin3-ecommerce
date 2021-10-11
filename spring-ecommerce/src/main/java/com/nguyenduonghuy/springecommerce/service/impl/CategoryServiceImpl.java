package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.CategoryDto;
import com.nguyenduonghuy.springecommerce.entity.Category;
import com.nguyenduonghuy.springecommerce.repository.CategoryRepository;
import com.nguyenduonghuy.springecommerce.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{

	@Autowired
	private CategoryRepository categoryRepository;
	
	@Override
	@Transactional
	public Page<CategoryDto> findAll(Integer isDeleted, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated"));
		return categoryRepository.findByIsDeleted(isDeleted, pageable)
							     .map(CategoryDto::new);
	}
	
	@Override
	@Transactional
	public Page<CategoryDto> findByName(String name, Integer isDeleted, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size);
		return categoryRepository.findByNameContainingAndIsDeleted(name, isDeleted, pageable)
								 .map(CategoryDto::new);
	}
	
	@Override
	@Transactional
	public CategoryDto getById(Long id, Integer isDeleted) {
		CategoryDto categoryDto = null;
		if (categoryRepository.findByIdAndIsDeleted(id, isDeleted) != null) {
			categoryDto = new CategoryDto(categoryRepository.findByIdAndIsDeleted(id, isDeleted));
		}
		return categoryDto;
	}
	
	@Override
	@Transactional
	public CategoryDto save(CategoryDto categoryDto) {
		Optional<Category> optional = categoryRepository.findById(categoryDto.getId());
		Category category = new Category();
		if (optional.isPresent()) {
			category = optional.get();
		}
		convert(category, categoryDto);
		categoryRepository.save(category);
		return categoryDto;
	}
	
	private void convert(Category category, CategoryDto categoryDto) {
		category.setId(categoryDto.getId());
		category.setName(categoryDto.getName());
		category.setIsDeleted(categoryDto.getIsDeleted());
		category.setImageUrl(categoryDto.getImageUrl());
	}
}
