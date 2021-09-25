package com.nguyenduonghuy.springecommerce.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.Purchase;
import com.nguyenduonghuy.springecommerce.dto.PurchaseResponse;
import com.nguyenduonghuy.springecommerce.persistence.Customer;
import com.nguyenduonghuy.springecommerce.persistence.Order;
import com.nguyenduonghuy.springecommerce.repository.CustomerRepository;

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
		
		// set status
		order.setStatus(1);
		
		// populate order with orderItems
		purchase.getOrderItems().forEach(orderItem -> order.add(orderItem));
		
		// populate order with address
		order.setAddress(purchase.getAddress());
		
		// populate customer with order
		Customer customer = purchase.getCustomer();
		
		// check if existed customer
		if (customerRepository.findByEmail(customer.getEmail()) != null) {
			customer = customerRepository.findByEmail(customer.getEmail()); // assign customer to customer from database
		}
		
		// add order to customer
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
