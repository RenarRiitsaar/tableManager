package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.EmployeeEvent;
import com.tableManager.tableManager.repository.EmployeeEventRepository;
import com.tableManager.tableManager.service.EmployeeEventService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class EmployeeEventServiceImpl implements EmployeeEventService {

    private final EmployeeEventRepository EERepository;

    public EmployeeEventServiceImpl(EmployeeEventRepository eeRepository) {
        EERepository = eeRepository;
    }

    @Override
    public List<EmployeeEvent> getAllEmployeeEvents(Long userID) {
        List<EmployeeEvent> employeeEventsByUser = new ArrayList<>();

        for(EmployeeEvent event: EERepository.findAll()){
            if(Objects.equals(userID, event.getUserId())){
                employeeEventsByUser.add(event);
            }
        }
        return employeeEventsByUser;
    }

    @Override
    public EmployeeEvent getEmployeeEventById(Long id, Long userId) {
        EmployeeEvent employeeEvent = EERepository.findById(id).orElse(null);

        if (Objects.equals(userId, employeeEvent.getUserId())) {
            return employeeEvent;
        } else {
            return null;
        }
    }

    @Override
    public void addEvent(EmployeeEvent employeeEvent, Long userId) {
        if(Objects.equals(userId, employeeEvent.getUserId())){
            EERepository.save(employeeEvent);
        }
    }

    @Override
    public void updateEmployeeEvent(EmployeeEvent employeeEvent, Long userId) {
    if(Objects.equals(userId, employeeEvent.getUserId())){
       EmployeeEvent event = EERepository.findById(employeeEvent.getId()).orElse(null);

       if(event != null) {
           event.setUserId(employeeEvent.getUserId());
           event.setEmployeeId(employeeEvent.getEmployeeId());
           event.setEventType(employeeEvent.getEventType());
           event.setStartDate(employeeEvent.getStartDate());
           event.setWorkHours(employeeEvent.getWorkHours());
           EERepository.save(event);
       }
    }
    }

    @Override
    public void deleteEmployeeEvent(EmployeeEvent employeeEvent, Long userId) {
        if(Objects.equals(userId, employeeEvent.getUserId())) {
            EERepository.delete(employeeEvent);
        }
    }
}
