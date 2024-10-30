package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.Row;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RowRepository extends JpaRepository<Row, Long> {
    List<Row> findByDataTableId(Long tableId);

}