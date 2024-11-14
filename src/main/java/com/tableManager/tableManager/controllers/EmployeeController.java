package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.Employee;
import com.tableManager.tableManager.service.impl.EmployeeServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import com.tableManager.tableManager.service.impl.VacationRequestServiceImpl;
import jakarta.persistence.GeneratedValue;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    private final EmployeeServiceImpl employeeService;
    private final VacationRequestServiceImpl vrService;
    private final UserServiceImpl userService;

    private static final String UPLOAD_DIR = "/data01/virt131441/domeenid/www.tablemanager.ee/EmployeePic/";
    private static final String DIR_PREFIX = "/data01/virt131441/domeenid/www.tablemanager.ee/EmployeePic/";

    public EmployeeController(EmployeeServiceImpl employeeService, VacationRequestServiceImpl vrService, UserServiceImpl userService) {
        this.employeeService = employeeService;
        this.vrService = vrService;
        this.userService = userService;
    }

    @DeleteMapping("/EmployeePhoto/{employeePic}")
    public ResponseEntity<Void> deletePhoto(@PathVariable String employeePic) {
        String imagePath = DIR_PREFIX + employeePic;

        File file = new File(imagePath);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        boolean isDeleted = file.delete();

        if (!isDeleted) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/EmployeePhoto/{employeePic}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String employeePic) {
        String imagePath = DIR_PREFIX + employeePic;

        File file = new File(imagePath);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        String contentType = "application/octet-stream";

        if (employeePic.toLowerCase().endsWith(".jpg") || employeePic.toLowerCase().endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (employeePic.toLowerCase().endsWith(".png")) {
            contentType = "image/png";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadEmployeePic(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "File is empty"));
            }
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/png") && !contentType.equals("image/jpeg"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type. Only PNG and JPG files are allowed.");
            }

            String filename = file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            String fileUrl = "src/EmployeePic/" + filename;
            return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to upload file"));
        }
    }

    @GetMapping("/{id}/{year}")
    public ResponseEntity<Integer> getUsedVacationDays(@PathVariable Long id, @PathVariable int year) {
        int usedVacationDays = vrService.calculateUsedVacation(id, year);
        return ResponseEntity.ok(usedVacationDays);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        Long currentUserId = userService.getCurrentUserId();
        List<Employee> userEmployees = new ArrayList<>();

        for(Employee emp: employeeService.GetAllEmployees()){
            if(emp.getUserId().equals(currentUserId)){
                userEmployees.add(emp);
            }

        }
        return new ResponseEntity<>(userEmployees, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Long currentUserId = userService.getCurrentUserId();
        Employee employeeById = employeeService.getEmployeeById(id);

        if(employeeById.getUserId().equals(currentUserId)){
            return new ResponseEntity<>(employeeById, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Long currentUserId = userService.getCurrentUserId();
        if(employee != null){

            employeeService.addEmployee(employee, currentUserId);
            return new ResponseEntity<>(employee, HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        Long currentUserId = userService.getCurrentUserId();

        Employee employeeById = employeeService.getEmployeeById(id);
        if(Objects.equals(employeeById.getUserId(), currentUserId)){
            employeeService.updateEmployee(employee);
            return new ResponseEntity<>(employeeById, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Employee> deleteEmployee(@PathVariable Long id) {
        Long currentUserId = userService.getCurrentUserId();

        Employee employeeById = employeeService.getEmployeeById(id);
        if(Objects.equals(employeeById.getUserId(), currentUserId)){
            employeeService.deleteEmployee(employeeById);
            return new ResponseEntity<>(employeeById, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
