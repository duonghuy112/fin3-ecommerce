package com.nguyenduonghuy.springecommerce.validator;

import java.util.regex.Pattern;

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
			isValid = Pattern.compile(", ").splitAsStream(badword)
								.anyMatch(bw -> value.contains(bw));
		}
		return isValid;
	}
}
