package com.nguyenduonghuy.springecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.nguyenduonghuy.springecommerce.entity.Category;
import com.nguyenduonghuy.springecommerce.entity.Product;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	@Autowired
	private EntityManager entityManager;
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		HttpMethod[] unsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH };

		// disable HTTP methods for Product: PUT, POST, DELETE and PATCH
		config.getExposureConfiguration()
				.forDomainType(Product.class)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

		// disable HTTP methods for Category: PUT, POST, DELETE and PATCH
		config.getExposureConfiguration()
				.forDomainType(Category.class)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
		
		// call an helper method
		exposeIds(config);
	}
	
	@SuppressWarnings("rawtypes")
	private void exposeIds(RepositoryRestConfiguration config) {
		// expose Id
		
		// - get a list of all entity classes from the entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		// - create an array of the entity types
		List<Class> entityClasses = new ArrayList<>();
		
		// - get the entity types for the entities
		entities.forEach(e -> entityClasses.add(e.getJavaType()));
		
		// - expose the entity ids for the array of the entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}
}