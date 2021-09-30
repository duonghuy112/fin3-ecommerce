package com.nguyenduonghuy.springecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
	public ResponseEntity<List<CustomerDto>> getALl() {
		return new ResponseEntity<>(customerService.findAll(), HttpStatus.OK);
	}
	
	@GetMapping("/findByEmail")
	public ResponseEntity<CustomerDto> getByEmail(@RequestParam String email) {
		return new ResponseEntity<>(customerService.getByEmail(email), HttpStatus.OK);
	}
}
