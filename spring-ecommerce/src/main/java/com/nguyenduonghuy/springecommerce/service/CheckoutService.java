package com.nguyenduonghuy.springecommerce.service;

import com.nguyenduonghuy.springecommerce.dto.PurchaseDto;
import com.nguyenduonghuy.springecommerce.dto.PurchaseResponse;

public interface CheckoutService {
	PurchaseResponse placeOrder(PurchaseDto purchase);
}
