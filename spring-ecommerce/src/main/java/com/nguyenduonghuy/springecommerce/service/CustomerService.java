package com.nguyenduonghuy.springecommerce.service;

import java.util.List;

import com.nguyenduonghuy.springecommerce.dto.CustomerDto;

public interface CustomerService {

	List<CustomerDto> findAll();
	
	CustomerDto getByEmail(String email);
}
