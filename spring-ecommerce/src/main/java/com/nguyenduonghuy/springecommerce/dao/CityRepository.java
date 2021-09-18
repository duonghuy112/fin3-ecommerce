package com.nguyenduonghuy.springecommerce.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.nguyenduonghuy.springecommerce.persistence.City;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "cities", path = "cities")
public interface CityRepository extends JpaRepository<City, Integer> {

	List<City> findByCountryCode(@Param("code") String code);
}
