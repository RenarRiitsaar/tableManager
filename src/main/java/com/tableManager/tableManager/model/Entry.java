package com.tableManager.tableManager.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false, updatable = false)
    private Long id;
    private int articleNum;
    private String articleName;
    private double priceBeforeTax;
    private double priceAfterTax;
    private int inventoryAmount;


    @JoinColumn(name = "user_id")
    private Long userId;

}
