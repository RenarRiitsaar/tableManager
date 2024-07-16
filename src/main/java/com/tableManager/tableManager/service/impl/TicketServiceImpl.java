package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.dto.TicketDTO;
import com.tableManager.tableManager.model.Ticket;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.TicketRepository;
import com.tableManager.tableManager.repository.UserRepository;
import com.tableManager.tableManager.service.TicketService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketServiceImpl(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Ticket findById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket createTicket(TicketDTO ticketDTO, Long userId) {
        Ticket ticket = new Ticket();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ticket.setUser(user);
        ticket.setMessage(ticketDTO.getMessage());
        ticketRepository.save(ticket);

        return ticket;
    }

    @Override
    public Ticket updateTicket(Long id, TicketDTO ticketDTO, Long userId) {
        Ticket ticket = findById(id);
        if (Objects.equals(ticket.getUser().getId(), userId) || userId == 1L) {
            ticket.setMessage(ticketDTO.getMessage());
            ticketRepository.save(ticket);
            return ticket;
        }else{
            return null;
        }
    }

    @Override
    public void deleteById(Long id, Long userId) {
        Ticket ticket = findById(id);

        if(Objects.equals(ticket.getUser().getId(), userId) ||userId == 1L) {
            ticketRepository.delete(ticket);
        }
    }
}