package com.nguyenduonghuy.springecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenduonghuy.springecommerce.persistence.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
	
	Customer findByEmail(String email);
}
