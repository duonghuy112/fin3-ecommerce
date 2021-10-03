package com.nguyenduonghuy.springecommerce.service.impl;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.CustomerDto;
import com.nguyenduonghuy.springecommerce.entity.Customer;
import com.nguyenduonghuy.springecommerce.repository.CustomerRepository;
import com.nguyenduonghuy.springecommerce.service.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService{

	@Autowired
	private CustomerRepository customerRepository;
	
	@Override
	@Transactional
	public Page<CustomerDto> findAll(int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated"));
		return customerRepository.findAll(pageable)
								 .map(CustomerDto::new);
	}
	
	@Override
	public Page<CustomerDto> findByIsAdmin(Integer isAdmin, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size);
		return customerRepository.findByIsAdmin(isAdmin, pageable)
								 .map(CustomerDto::new);
	}

	@Override
	@Transactional
	public CustomerDto getByEmail(String email) {
		return new CustomerDto(customerRepository.findByEmail(email));
	}
	
	@Override
	@Transactional
	public CustomerDto save(CustomerDto customerDto) {
		Customer customer = new Customer();
		convert(customer, customerDto);
		customerRepository.save(customer);
		return customerDto;
	}
	
	private void convert(Customer customer, CustomerDto customerDto) {
		customer.setId(customerDto.getId());
		customer.setFirstName(customerDto.getFirstName());
		customer.setLastName(customerDto.getLastName());
		customer.setEmail(customerDto.getEmail());
		customer.setAvatar(customerDto.getAvatar());
		customer.setDateCreated(customerDto.getDateCreated());
		customer.setLastUpdated(customerDto.getLastUpdated());
		customer.setIsAdmin(customerDto.getIsAdmin());
		customer.setIsActivate(customerDto.getIsActivate());
	}

}
