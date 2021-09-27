package com.nguyenduonghuy.springecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
	private String firstName;
	private String lastName;
	private String email;
}
