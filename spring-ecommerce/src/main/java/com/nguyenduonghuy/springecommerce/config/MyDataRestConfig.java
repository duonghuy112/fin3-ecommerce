package com.nguyenduonghuy.springecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.nguyenduonghuy.springecommerce.entity.Category;
import com.nguyenduonghuy.springecommerce.entity.Product;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		HttpMethod[] unsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH };

		// disable HTTP methods for Product: PUT, POST, DELETE and PATCH
		config.getExposureConfiguration()
				.forDomainType(Product.class)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

		// disable HTTP methods for Product: PUT, POST, DELETE and PATCH
		config.getExposureConfiguration()
				.forDomainType(Category.class)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
	}
}