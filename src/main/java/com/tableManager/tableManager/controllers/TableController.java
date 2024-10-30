package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.DataTable;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.service.impl.TableServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/tables")
public class TableController {

    private final TableServiceImpl tableService;
    private final UserServiceImpl userService;

    public TableController(TableServiceImpl tableService, UserServiceImpl userService) {
        this.tableService = tableService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<DataTable> createTable(@RequestBody DataTable table) {
        Long userId = userService.getCurrentUserId();
        User user = userService.findbyId(userId);

        tableService.createTable(table, user);


        return new ResponseEntity<>(table,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<DataTable>> getTables() {

        Long userId = userService.getCurrentUserId();
        List<DataTable> allTables = tableService.getAllTables();
        List<DataTable> currentUserTables = new ArrayList<>();

        for(DataTable table : allTables) {
            if(table.getUser().getId().equals(userId)){
                currentUserTables.add(table);
            }
        }
        if(!currentUserTables.isEmpty()) {

            return new ResponseEntity<>(currentUserTables, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<DataTable>> getTable(@PathVariable Long id) {
        Long userId = userService.getCurrentUserId();
        User user = userService.findbyId(userId);

        Optional<DataTable> table = tableService.getTableById(id);

        if(table.isPresent() && table.get().getUser().getId().equals(userId)) {
            return new ResponseEntity<>(table, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DataTable> updateTable(@PathVariable Long id, @RequestBody DataTable newTableData) {
        Long userId = userService.getCurrentUserId();

        try {
            if(newTableData.getUser().getId().equals(userId)) {
                DataTable updatedTable = tableService.updateTable(id, newTableData);
                return new ResponseEntity<>(updatedTable, HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        Long userId = userService.getCurrentUserId();
        Optional<DataTable> table = tableService.getTableById(id);
        try {
            if(table.isPresent() && table.get().getUser().getId().equals(userId)) {
                tableService.deleteTable(id);
                return new ResponseEntity<>(HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}