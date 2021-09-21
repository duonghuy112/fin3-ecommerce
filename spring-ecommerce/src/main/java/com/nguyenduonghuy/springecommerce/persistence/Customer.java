package com.nguyenduonghuy.springecommerce.persistence;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customer")
@Getter
@Setter
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "first_name")
	@NotBlank
	@Size(min = 2, max = 255)
	private String firstName;
	
	@Column(name = "last_name")
	@NotBlank
	@Size(min = 2, max = 255)
	private String lastName;
	
	@Column(name = "email")
	@NotBlank
	@Size(min = 2, max = 255)
	@Email
	private String email;
	
	@OneToMany(mappedBy = "customer")
	private List<Review> reviews;

	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
	private Set<Order> orders;
	
	public void add(Order order) {
		if (order != null) {
			if (orders == null) {
				orders = new HashSet<>();
			}
			order.setCustomer(this);
			orders.add(order);
		}
	}
}
