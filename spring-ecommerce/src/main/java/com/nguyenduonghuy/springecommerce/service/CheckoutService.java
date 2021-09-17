package com.nguyenduonghuy.springecommerce.service;

import com.nguyenduonghuy.springecommerce.dto.Purchase;
import com.nguyenduonghuy.springecommerce.dto.PurchaseResponse;

public interface CheckoutService {
	PurchaseResponse placeOrder(Purchase purchase);
}
