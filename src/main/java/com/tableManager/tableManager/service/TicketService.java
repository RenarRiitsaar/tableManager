package com.tableManager.tableManager.service;

import com.tableManager.tableManager.dto.TicketDTO;
import com.tableManager.tableManager.model.Ticket;

import java.util.List;

public interface TicketService {

    Ticket findById(Long id);

    List<Ticket> findAll();

    Ticket createTicket(TicketDTO ticketDTO, Long userId);

    Ticket updateTicket(Long id, TicketDTO ticketDTO, Long userId);

    void deleteById(Long id, Long userId);

    void setActive(Long id);

    Ticket answerTicket(Long id, TicketDTO ticketDTO);

    List<Ticket> findByUserId(Long userId);
}
