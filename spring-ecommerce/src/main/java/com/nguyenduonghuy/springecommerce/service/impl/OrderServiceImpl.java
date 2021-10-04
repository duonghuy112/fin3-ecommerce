package com.nguyenduonghuy.springecommerce.service.impl;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduonghuy.springecommerce.dto.OrderDto;
import com.nguyenduonghuy.springecommerce.entity.Order;
import com.nguyenduonghuy.springecommerce.repository.CustomerRepository;
import com.nguyenduonghuy.springecommerce.repository.OrderRepository;
import com.nguyenduonghuy.springecommerce.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService{

	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private CustomerRepository customerRepository;

	@Override
	public Page<OrderDto> findAll(int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated").descending());
		return orderRepository.findAll(pageable)
							  .map(OrderDto::new);
	}
	
	@Override
	@Transactional
	public Page<OrderDto> findByCustomerEmail(String email, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated").descending());
		return orderRepository.findByCustomerEmail(email, pageable)
							  .map(OrderDto::new);
	}
	
	@Override
	public Page<OrderDto> findByStatus(Integer status, int page, int size, Pageable pageable) {
		pageable = PageRequest.of(page, size, Sort.by("dateCreated").descending());
		return orderRepository.findByStatus(status, pageable)
							   .map(OrderDto::new);
	}
	
	@Override
	@Transactional
	public OrderDto save(OrderDto orderDto) {
		Optional<Order> optional = orderRepository.findById(orderDto.getId());
		Order order = new Order();
		if (optional.isEmpty()) {
			order = optional.get();
		}
		convert(order, orderDto);
		orderRepository.save(order);
		return orderDto;
	}
	
	private void convert(Order order, OrderDto orderDto) {
		order.setId(orderDto.getId());
		order.setOrderTrackingNumber(orderDto.getOrderTrackingNumber());
		order.setTotalQuantity(orderDto.getTotalQuantity());
		order.setTotalPrice(orderDto.getTotalPrice());
		order.setStatus(orderDto.getStatus());
		order.setDateCreated(orderDto.getDateCreated());
		order.setLastUpdated(orderDto.getLastUpdated());
		order.setCustomer(customerRepository.getById(orderDto.getCustomer().getId()));
		order.setAddress(orderDto.getAddress());
		
	}
	
}
