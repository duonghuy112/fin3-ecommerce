package com.nguyenduonghuy.springecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduonghuy.springecommerce.dto.CustomerDto;
import com.nguyenduonghuy.springecommerce.service.CustomerService;

@RestController
@RequestMapping("api/customers")
public class CustomerController {

	@Autowired
	private CustomerService customerService;
	
	@GetMapping
	public ResponseEntity<Page<CustomerDto>> getALl(@RequestParam int page,
													@RequestParam int size,
													Pageable pageable) {
		return new ResponseEntity<>(customerService.findAll(page, size, pageable), HttpStatus.OK);
	}
	
	@GetMapping("/findByAdmin")
	public ResponseEntity<Page<CustomerDto>> getByAdmin(@RequestParam Integer isAdmin,
														@RequestParam int page,
														@RequestParam int size,
														Pageable pageable) {
		return new ResponseEntity<>(customerService.findByIsAdmin(isAdmin, page, size, pageable), HttpStatus.OK);
	}
	
	@GetMapping("/findByName")
	public ResponseEntity<Page<CustomerDto>> getByName(@RequestParam String name,
														@RequestParam int page,
														@RequestParam int size,
														Pageable pageable) {
		return new ResponseEntity<>(customerService.findByName(name, page, size, pageable), HttpStatus.OK);
	}
	
	@GetMapping("/findByEmail")
	public ResponseEntity<CustomerDto> getByEmail(@RequestParam String email) {
		return new ResponseEntity<>(customerService.findByEmail(email), HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<CustomerDto> add(@RequestBody CustomerDto customerDto) {
		return new ResponseEntity<>(customerService.save(customerDto), HttpStatus.CREATED);
	}
}
