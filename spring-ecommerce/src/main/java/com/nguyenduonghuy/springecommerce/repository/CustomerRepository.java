package com.nguyenduonghuy.springecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.nguyenduonghuy.springecommerce.persistence.Customer;

@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Long>{
	
	Customer findByEmail(@Param("email") String email);
}
