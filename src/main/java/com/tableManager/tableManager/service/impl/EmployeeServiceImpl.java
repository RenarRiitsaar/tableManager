package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.Employee;
import com.tableManager.tableManager.repository.EmployeeRepository;
import com.tableManager.tableManager.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Employee> GetAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public void addEmployee(Employee employee, Long userId) {
        Employee newEmployee = new Employee();
        newEmployee.setName(employee.getName());
        newEmployee.setEmail(employee.getEmail());
        newEmployee.setIBAN(employee.getIBAN());
        newEmployee.setPhone(employee.getPhone());
        newEmployee.setPhotoURL(employee.getPhotoURL());
        newEmployee.setUserId(userId);
        employeeRepository.save(newEmployee);
    }

    @Override
    public void updateEmployee(Employee employee) {
        Employee employeeById = employeeRepository.findById(employee.getId()).orElse(null);
        if (employeeById != null) {
            employeeById.setName(employee.getName());
            employeeById.setPhotoURL(employee.getPhotoURL());
            employeeById.setEmail(employee.getEmail());
            employeeById.setPhone(employee.getPhone());
            employeeById.setIBAN(employee.getIBAN());
            employeeRepository.save(employeeById);
        }
    }

    @Override
    public void deleteEmployee(Employee employee) {
        employeeRepository.delete(employee);
    }
}
