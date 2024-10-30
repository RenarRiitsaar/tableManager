package com.tableManager.tableManager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "data_table_cells")
public class Cell {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String value;
    private String dataType;
    @ManyToOne
    @JoinColumn(name ="row_id", nullable = false)
    @JsonIgnore
    private Row row;
}