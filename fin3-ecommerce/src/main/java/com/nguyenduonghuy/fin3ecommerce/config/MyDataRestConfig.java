package com.nguyenduonghuy.fin3ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.nguyenduonghuy.fin3ecommerce.entity.Category;
import com.nguyenduonghuy.fin3ecommerce.entity.Product;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		HttpMethod[] unsupportedAction = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};
		
		// disable Http methods for Product: PUT, POST, DELETE
		config.getExposureConfiguration()
			  .forDomainType(Product.class)
			  .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction))
			  .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction));
		
		// disable Http methods for Category: PUT, POST, DELETE
		config.getExposureConfiguration()
			  .forDomainType(Category.class)
			  .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction))
			  .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedAction));		
	}
}
