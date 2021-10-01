package com.nguyenduonghuy.springecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.nguyenduonghuy.springecommerce.entity.Category;
import com.nguyenduonghuy.springecommerce.entity.City;
import com.nguyenduonghuy.springecommerce.entity.Country;
import com.nguyenduonghuy.springecommerce.entity.OrderItem;
import com.nguyenduonghuy.springecommerce.entity.Product;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	@Autowired
	private EntityManager entityManager;
	
	@Value("${allowed.origins}")
	private String[] origins;
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		HttpMethod[] unsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH };

		// disable HTTP methods: PUT, POST, DELETE and PATCH
		disableHttpMethods(Product.class, config, unsupportedActions);
		disableHttpMethods(Category.class, config, unsupportedActions);
		disableHttpMethods(Country.class, config, unsupportedActions);
		disableHttpMethods(City.class, config, unsupportedActions);
		disableHttpMethods(OrderItem.class, config, unsupportedActions);
		
		// expose id for entity
		exposeIds(config);
		
		// configure cors mapping
		cors.addMapping(config.getBasePath() + "/**").allowedOrigins(origins);
	}

	private void disableHttpMethods(Class<?> entityClass, RepositoryRestConfiguration config, HttpMethod...unsupportedActions) {
		config.getExposureConfiguration()
				.forDomainType(entityClass)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
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