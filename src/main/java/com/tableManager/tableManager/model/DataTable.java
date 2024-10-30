package com.tableManager.tableManager.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;


@Entity
@Getter @Setter
public class DataTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToMany(mappedBy = "dataTable", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Row> rows;
   @ManyToOne
    @JoinColumn(name= "user_id")
   @JsonIgnore
    private User user;
}