package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.EmployeeEvent;
import com.tableManager.tableManager.service.EmployeeEventService;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/event")
@CrossOrigin("*")
public class EmployeeEventController {

    private final EmployeeEventService employeeEventService;
    private final UserServiceImpl userService;

    public EmployeeEventController(EmployeeEventService employeeEventService, UserServiceImpl userService) {
        this.employeeEventService = employeeEventService;
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<EmployeeEvent>> getEmployeeEvents() {
        Long currentUserId = userService.getCurrentUserId();

        return new ResponseEntity<>(employeeEventService.getAllEmployeeEvents(currentUserId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeEvent> getEmployeeEvent(@PathVariable Long id) {
        Long currentUserId = userService.getCurrentUserId();

        EmployeeEvent event = employeeEventService.getEmployeeEventById(id, currentUserId);

        if (event != null) {
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping()
    public ResponseEntity<EmployeeEvent> addEmployeeEvent(@RequestBody EmployeeEvent employeeEvent) {
        Long currentUserId = userService.getCurrentUserId();
        employeeEventService.addEvent(employeeEvent, currentUserId);

        if (employeeEvent.getEmployeeId() != null) {
            return new ResponseEntity<>(employeeEvent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeEvent> updateEmployeeEvent(@PathVariable Long id, @RequestBody EmployeeEvent employeeEvent) {
        Long currentUserId = userService.getCurrentUserId();
        EmployeeEvent event = employeeEventService.getEmployeeEventById(id, currentUserId);
        if (event != null) {
            employeeEventService.updateEmployeeEvent(employeeEvent, currentUserId);
            return new ResponseEntity<>(HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EmployeeEvent> deleteEmployeeEvent(@PathVariable Long id) {
        Long currentUserId = userService.getCurrentUserId();
        EmployeeEvent event = employeeEventService.getEmployeeEventById(id, currentUserId);
        if (event != null) {
            employeeEventService.deleteEmployeeEvent(event, currentUserId);
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }
}
