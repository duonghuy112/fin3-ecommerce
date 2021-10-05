package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.CustomerDto;

public interface CustomerService {

	Page<CustomerDto> findAll(int page, int size, Pageable pageable);
	
	Page<CustomerDto> findByIsAdmin(Integer isAdmin, int page, int size, Pageable pageable);
	
	Page<CustomerDto> findByName(String name, int page, int size, Pageable pageable);
	
	CustomerDto findByEmail(String email);
	
	CustomerDto save(CustomerDto customerDto);
}
