package com.nguyenduonghuy.springecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.okta.spring.boot.oauth.Okta;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter{

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// protect endpoint: /api/order
		http.authorizeRequests()
				.antMatchers("/api/orders/**")
				.authenticated()
				.antMatchers("api/orderItems/**")
				.authenticated()
				.antMatchers("api/customers/**")
				.authenticated()
				.and()
				.oauth2ResourceServer()
				.jwt();
		
		// add CORS filter
		http.cors();
		
		// force a non-empty response body for 401
        Okta.configureResourceServer401ResponseBody(http);

        // disable CSRF since not using Cookies for session tracking
        http.csrf().disable();
	}
}
