package com.tableManager.tableManager.service;


import com.tableManager.tableManager.model.Employee;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface EmployeeService {

    List<Employee> GetAllEmployees();
    Employee getEmployeeById(Long id);
    void addEmployee(Employee employee, Long userId);
    void updateEmployee(Employee employee);
    void deleteEmployee(Employee employee);
}
