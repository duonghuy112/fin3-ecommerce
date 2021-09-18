package com.nguyenduonghuy.springecommerce.dto;

import java.util.Set;

import com.nguyenduonghuy.springecommerce.persistence.Address;
import com.nguyenduonghuy.springecommerce.persistence.Customer;
import com.nguyenduonghuy.springecommerce.persistence.Order;
import com.nguyenduonghuy.springecommerce.persistence.OrderItem;

import lombok.Data;

@Data
public class Purchase {
	private Customer customer;
	private Address address;
	private Order order;
	private Set<OrderItem> orderItems;
}
