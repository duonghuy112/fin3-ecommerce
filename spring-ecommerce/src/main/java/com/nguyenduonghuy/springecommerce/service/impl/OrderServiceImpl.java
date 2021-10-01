package com.nguyenduonghuy.springecommerce.service.impl;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.OrderDto;
import com.nguyenduonghuy.springecommerce.repository.OrderRepository;
import com.nguyenduonghuy.springecommerce.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService{

	@Autowired
	private OrderRepository orderRepository;

	@Override
	@Transactional
	public Page<OrderDto> findByCustomerEmail(String email, Integer page, Integer size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated").descending());
		return orderRepository.findByCustomerEmail(email, pageable)
							  .map(OrderDto::new);
	}
	
}
