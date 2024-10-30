package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.DataTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableRepository extends JpaRepository<DataTable, Long> {
}