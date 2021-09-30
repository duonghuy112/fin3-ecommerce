package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.CustomerDto;
import com.nguyenduonghuy.springecommerce.repository.CustomerRepository;
import com.nguyenduonghuy.springecommerce.service.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService{

	@Autowired
	private CustomerRepository customerRepository;
	
	@Override
	@Transactional
	public List<CustomerDto> findAll() {
		return customerRepository.findAll().stream()
										   .map(CustomerDto::new)
										   .collect(Collectors.toList());
	}

	@Override
	@Transactional
	public CustomerDto getByEmail(String email) {
		return new CustomerDto(customerRepository.findByEmail(email));
	}

}
