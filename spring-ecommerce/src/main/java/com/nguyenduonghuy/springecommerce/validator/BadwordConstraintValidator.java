package com.nguyenduonghuy.springecommerce.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class BadwordConstraintValidator implements ConstraintValidator<BadwordConstraint, String>{

	private String badword;

	@Override
	public void initialize(BadwordConstraint badwordConstraint) {
		badword = badwordConstraint.value();
	}
	
	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		boolean isValid = false;
		if (value != null) {
			isValid = !badword.contains(value);
		} else {
			isValid = true;
		}
		return isValid;
	}
	
	
}
