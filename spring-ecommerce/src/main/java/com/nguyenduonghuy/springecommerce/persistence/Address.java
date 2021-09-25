package com.nguyenduonghuy.springecommerce.persistence;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "country")
	private String country;
	
	@Column(name = "city")
	private String city;
	
	@Column(name = "district")
	@Size(min = 2, max = 255)
	private String district;
	
	@Column(name = "street")
	@NotBlank
	@Size(min = 2, max = 255)
	private String street;
	
	@Column(name = "zip_code")
	@Size(min = 2, max = 255)
	private String zipCode;
	
	@OneToOne
	@PrimaryKeyJoinColumn
	private Order order;
}
