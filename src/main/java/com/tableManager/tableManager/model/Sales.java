package com.tableManager.tableManager.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "sale_id")
    private Long id;
    private double totalPrice;
    private String clientName;
    private String invoiceNumber;
    private String customerAddress;
    private Long regNr;
    private String customerEmail;
    private String invoiceType;
    private LocalDateTime saleDate = LocalDateTime.now();

    @JoinColumn(name = "user_id")
    private Long userId;
}
