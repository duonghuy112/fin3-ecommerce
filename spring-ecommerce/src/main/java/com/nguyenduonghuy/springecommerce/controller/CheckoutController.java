package com.nguyenduonghuy.springecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nguyenduonghuy.springecommerce.dto.PurchaseDto;
import com.nguyenduonghuy.springecommerce.dto.PurchaseResponse;
import com.nguyenduonghuy.springecommerce.service.CheckoutService;

@RestController
@RequestMapping("api/checkout")
public class CheckoutController {
	
	@Autowired
	private CheckoutService checkoutService;
	
	@PostMapping("/purchase")
	public ResponseEntity<PurchaseResponse> placeOrder(@RequestBody PurchaseDto purchase) {
		PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
		return new ResponseEntity<>(purchaseResponse, HttpStatus.CREATED);
	}
}
