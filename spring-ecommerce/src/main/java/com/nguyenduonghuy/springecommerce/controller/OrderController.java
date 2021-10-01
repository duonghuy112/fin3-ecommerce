package com.nguyenduonghuy.springecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduonghuy.springecommerce.dto.OrderDto;
import com.nguyenduonghuy.springecommerce.service.OrderService;

@RestController
@RequestMapping("api/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;
	
	@GetMapping("/findByCustomerEmail")
	public ResponseEntity<Page<OrderDto>> getByCustomerEmail(@RequestParam String email,
															 @RequestParam Integer page,
															 @RequestParam Integer size,
															 Pageable pageable) {
		return new ResponseEntity<>(orderService.findByCustomerEmail(email, page, size, pageable), 
									HttpStatus.OK);
	}
}
