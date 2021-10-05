package com.nguyenduonghuy.springecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	@GetMapping
	public ResponseEntity<Page<OrderDto>> getAll(@RequestParam int page,
												 @RequestParam int size,
												 Pageable pageable) {
		return new ResponseEntity<>(orderService.findAll(page, size, pageable), HttpStatus.OK);
	}
	
	@GetMapping("/findByCustomerEmail")
	public ResponseEntity<Page<OrderDto>> getByCustomerEmail(@RequestParam String email,
															 @RequestParam int page,
															 @RequestParam int size,
															 Pageable pageable) {
		return new ResponseEntity<>(orderService.findByCustomerEmail(email, page, size, pageable), 
									HttpStatus.OK);
	}
	
	@GetMapping("/findByStatus")
	public ResponseEntity<Page<OrderDto>> getByStatus(@RequestParam Integer status,
															 @RequestParam int page,
															 @RequestParam int size,
															 Pageable pageable) {
		return new ResponseEntity<>(orderService.findByStatus(status, page, size, pageable), 
									HttpStatus.OK);
	}
	
	@GetMapping("/findByOrderTrackingNumber")
	public ResponseEntity<Page<OrderDto>> getByStatus(@RequestParam String orderTrackingNumber,
															 @RequestParam int page,
															 @RequestParam int size,
															 Pageable pageable) {
		return new ResponseEntity<>(orderService.findByOrderTrackingNumber(orderTrackingNumber, page, size, pageable), 
									HttpStatus.OK);
	}
	
	@GetMapping("/findById")
	public ResponseEntity<OrderDto> update(@RequestParam Long id) {
		return new ResponseEntity<>(orderService.findById(id), HttpStatus.OK);
	}
	
	@PutMapping("/{orderId}")
	public ResponseEntity<OrderDto> update(@RequestBody OrderDto orderDto,
										   @PathVariable("orderId") Long id) {
		return new ResponseEntity<>(orderService.save(orderDto), HttpStatus.OK);
	}
}
