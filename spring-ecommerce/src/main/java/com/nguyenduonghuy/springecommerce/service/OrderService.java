package com.nguyenduonghuy.springecommerce.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.nguyenduonghuy.springecommerce.dto.OrderDto;

public interface OrderService {

	Page<OrderDto> findByCustomerEmail(String email, Integer page, Integer size, Pageable pageable);
}
