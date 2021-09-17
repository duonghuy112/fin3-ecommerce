package com.nguyenduonghuy.springecommerce.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "order_tracking_number")
	private String orderTrackingNumber;
	
	@Column(name = "total_quantity")
	private int totalQuantity;
	
	@Column(name = "total_price")
	private BigDecimal totalPrice;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "date_created")
	@CreationTimestamp
	private LocalDateTime dateCreated;
	
	@Column(name = "last_updated")
	@UpdateTimestamp
	private LocalDateTime lastUpdated;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	private Set<OrderItem> orderItems;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	private Customer customer;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "address_id", referencedColumnName = "id")
	private Address address;
	
	// method for add item into orderItems 
	public void add(OrderItem orderItem) {
		if (orderItem != null) {
			if (orderItems == null) {
				orderItems = new HashSet<>();
			}
			orderItem.setOrder(this);
			orderItems.add(orderItem);
		}
	}
}
