package com.nguyenduonghuy.springecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenduonghuy.springecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
}