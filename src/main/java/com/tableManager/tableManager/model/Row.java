package com.tableManager.tableManager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="data_table_row")
@Getter @Setter
public class Row {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JsonIgnore
    private DataTable dataTable;
    @OneToMany(mappedBy = "row",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cell> cells;
}