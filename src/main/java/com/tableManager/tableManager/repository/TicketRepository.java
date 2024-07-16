package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

}
