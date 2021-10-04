package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.OrderDto;

public interface OrderService {
	
	Page<OrderDto> findAll(int page, int size, Pageable pageable);

	Page<OrderDto> findByCustomerEmail(String email, int page, int size, Pageable pageable);
	
	Page<OrderDto> findByStatus(Integer status, int page, int size, Pageable pageable);
	
	OrderDto save(OrderDto orderDto);
}
