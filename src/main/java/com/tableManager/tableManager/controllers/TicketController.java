package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.dto.TicketDTO;
import com.tableManager.tableManager.model.Ticket;
import com.tableManager.tableManager.service.TicketService;
import com.tableManager.tableManager.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin("*")
public class TicketController {

    private final TicketService ticketService;
    private final UserService userService;

    public TicketController(TicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }

    @PutMapping("/toggleTicket/{id}")
    public ResponseEntity<TicketDTO> toggleTicket(@PathVariable Long id) {
        ticketService.setActive(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/answerTicket/{id}")
    public ResponseEntity<TicketDTO> answerTicket(@PathVariable Long id, @RequestBody TicketDTO ticketDTO) {
        ticketService.answerTicket(id, ticketDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(ticketService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTicketsByUserId(@PathVariable Long userId) {
        Long currentUserId = userService.getCurrentUserId();

        if(currentUserId.equals(userId)) {

            return ResponseEntity.ok(ticketService.findByUserId(userId));
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        Long currentUserId = userService.getCurrentUserId();
        Long adminId = 1L;
        Ticket ticket = ticketService.findById(id);

        if(ticket != null && Objects.equals(ticket.getUser().getId(), currentUserId)
            || ticket != null && Objects.equals(currentUserId, adminId)){

            return new ResponseEntity<>(ticket, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/newTicket")
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketDTO ticketDTO) {
        Long currentUserId = userService.getCurrentUserId();
        Ticket ticket = ticketService.createTicket(ticketDTO, currentUserId);
        return new ResponseEntity<>(ticket, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody TicketDTO ticketDTO) {
        Long currentUserId = userService.getCurrentUserId();

        Ticket ticket = ticketService.updateTicket(id, ticketDTO, currentUserId);

        if(ticket != null) {
            return new ResponseEntity<>(ticket, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        }

    @DeleteMapping("/delete/{id}")
    public void deleteTicket(@PathVariable Long id) {
        Long currentUserId = userService.getCurrentUserId();

        ticketService.deleteById(id, currentUserId);

    }
}

