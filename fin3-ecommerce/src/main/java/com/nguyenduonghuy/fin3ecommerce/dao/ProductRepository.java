package com.nguyenduonghuy.fin3ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nguyenduonghuy.fin3ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
