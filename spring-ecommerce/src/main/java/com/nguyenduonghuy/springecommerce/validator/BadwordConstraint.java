package com.nguyenduonghuy.springecommerce.validator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Constraint(validatedBy = BadwordConstraintValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface BadwordConstraint {
	// define default value
	public String value() default "fuck, bitch, shit, dick, asshole, damn";

	// define default message
	public String message() default "must not contain any badword!";

	public Class<?>[] groups() default {};

	public Class<? extends Payload>[] payload() default {};
}
