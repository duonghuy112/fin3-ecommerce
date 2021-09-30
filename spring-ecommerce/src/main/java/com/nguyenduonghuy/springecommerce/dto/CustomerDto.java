package com.nguyenduonghuy.springecommerce.dto;

import java.time.LocalDateTime;

import com.nguyenduonghuy.springecommerce.entity.Customer;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CustomerDto {
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String avatar;
	private LocalDateTime dateCreated;
	private LocalDateTime lastUpdated;
	
	public CustomerDto(Customer customer) {
		this.id = customer.getId();
		this.firstName = customer.getFirstName();
		this.lastName = customer.getLastName();
		this.email = customer.getEmail();
		this.avatar = customer.getAvatar();
		this.dateCreated = customer.getDateCreated();
		this.lastUpdated = customer.getLastUpdated();
	}
}
