package com.nguyenduonghuy.springecommerce.dto;

import java.util.Set;

import com.nguyenduonghuy.springecommerce.entity.Address;
import com.nguyenduonghuy.springecommerce.entity.Customer;
import com.nguyenduonghuy.springecommerce.entity.Order;
import com.nguyenduonghuy.springecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class PurchaseDto {
	private Customer customer;
	private Address address;
	private Order order;
	private Set<OrderItem> orderItems;
}
