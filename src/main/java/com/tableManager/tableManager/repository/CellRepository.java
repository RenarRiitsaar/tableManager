package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.Cell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CellRepository extends JpaRepository<Cell, Long> {

    List<Cell> findByRowId(Long rowId);
}