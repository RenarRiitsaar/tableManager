package com.tableManager.tableManager.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PdfSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false, updatable = false)
    private Long id;
    private String logoURL;
    private String companyName;
    private String companyAddress;
    private String companyCity;
    private String companyPhone;
    private String companyEmail;
    private String bankDetails;

    @JoinColumn(name = "user_id")
    private Long userId;


}
