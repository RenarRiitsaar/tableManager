package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.DataTable;
import com.tableManager.tableManager.model.Row;
import com.tableManager.tableManager.service.RowService;
import com.tableManager.tableManager.service.TableService;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables/{tableId}/rows")
@CrossOrigin("*")
public class RowController {
    private final RowService rowService;
    private final UserServiceImpl userService;
    private final TableService tableService;


    public RowController(RowService rowService, UserServiceImpl userService, TableService tableService) {
        this.rowService = rowService;

        this.userService = userService;
        this.tableService = tableService;
    }


    @PostMapping
    public ResponseEntity<Row> createRow(@PathVariable("tableId") Long tableId) {
        Long userId = userService.getCurrentUserId();

        Row row = new Row();
        rowService.createRow(tableId, row, userId);
        return new ResponseEntity<>(row, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Row>> getRows(@PathVariable("tableId") Long tableId){
        Long userId = userService.getCurrentUserId();
        List<Row> rows = rowService.getRowsByTableId(tableId, userId);
        return new ResponseEntity<>(rows, HttpStatus.OK);
    }


    @DeleteMapping("/{rowId}")
    public ResponseEntity<?> deleteRow(@PathVariable("tableId") Long tableId, @PathVariable("rowId") Long rowId){
        Long userId = userService.getCurrentUserId();

        rowService.deleteById(rowId, userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}