package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.EmployeeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeEventRepository extends JpaRepository<EmployeeEvent, Long> {
}
