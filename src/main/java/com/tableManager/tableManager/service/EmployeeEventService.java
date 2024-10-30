package com.tableManager.tableManager.service;

import com.tableManager.tableManager.model.EmployeeEvent;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EmployeeEventService {

    List<EmployeeEvent> getAllEmployeeEvents(Long userID);
    EmployeeEvent getEmployeeEventById(Long id, Long userId);
    void addEvent(EmployeeEvent employeeEvent, Long userId);
    void updateEmployeeEvent(EmployeeEvent employeeEvent, Long userId);
    void deleteEmployeeEvent(EmployeeEvent employeeEvent, Long userId);
}
