package com.nguyenduonghuy.springecommerce.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dao.CustomerRepository;
import com.nguyenduonghuy.springecommerce.dto.Purchase;
import com.nguyenduonghuy.springecommerce.dto.PurchaseResponse;
import com.nguyenduonghuy.springecommerce.entity.Customer;
import com.nguyenduonghuy.springecommerce.entity.Order;

@Service
public class CheckoutServiceImpl implements CheckoutService{
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {
		// retrieve the order's info from dto
		Order order = purchase.getOrder();
		
		// generate tracking number
		String orderTrackingNumber = generateOrderTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		// populate order with orderItems
		purchase.getOrderItems().forEach(orderItem -> order.add(orderItem));
		
		// populate order with address
		order.setAddress(purchase.getAddress());
		
		// populate customer with order
		Customer customer = purchase.getCustomer();
		customer.add(order);
		
		// save to database
		customerRepository.save(customer);
		
		// return a response
		return new PurchaseResponse(orderTrackingNumber);
	}
	
	private String generateOrderTrackingNumber() {
		// generate a random UUID number
		return UUID.randomUUID().toString();
	}
}
