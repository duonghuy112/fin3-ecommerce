package com.nguyenduonghuy.springecommerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.entity.Customer;

@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Long>{
	
	Page<Customer> findByIsAdmin(Integer isAdmin, Pageable pageable);
	
	Page<Customer> findByFirstNameContainingOrLastNameContainingOrEmailContaining(String firstName,
																				  String lastName,
																				  String email,
																				  Pageable pageable);
	
	Customer findByEmail(String email);
}
