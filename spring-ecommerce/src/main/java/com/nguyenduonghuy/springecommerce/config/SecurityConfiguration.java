package com.nguyenduonghuy.springecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter{

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// protect endpoint: /api/order
		http.authorizeRequests()
				.antMatchers("/api/orders/**")
				.authenticated()
				.and()
				.oauth2ResourceServer()
				.jwt();
		
		// add CORS filter
		http.cors();
	}
}
