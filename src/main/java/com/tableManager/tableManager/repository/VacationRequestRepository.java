package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest,Long> {

}
