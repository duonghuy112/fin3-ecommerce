package com.nguyenduonghuy.springecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.nguyenduonghuy.springecommerce.entity.Address;
import com.nguyenduonghuy.springecommerce.entity.Order;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderDto {
	private Long id;
	private String orderTrackingNumber;
	private Integer totalQuantity;
	private BigDecimal totalPrice;
	private Integer status;
	private LocalDateTime dateCreated;
	private LocalDateTime lastUpdated;
	private CustomerDto customer;
	private Address address;
	
	public OrderDto(Order order) {
		this.id = order.getId();
		this.orderTrackingNumber = order.getOrderTrackingNumber();
		this.totalQuantity = order.getTotalQuantity();
		this.totalPrice = order.getTotalPrice();
		this.status = order.getStatus();
		this.dateCreated = order.getDateCreated();
		this.lastUpdated = order.getLastUpdated();
		this.customer = new CustomerDto(order.getCustomer());
		this.address = order.getAddress();
	}
}
