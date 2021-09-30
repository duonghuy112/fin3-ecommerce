package com.nguyenduonghuy.springecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.entity.Customer;

@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Long>{
	
	Customer findByEmail(String email);
}
