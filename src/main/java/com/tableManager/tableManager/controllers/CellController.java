package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.Cell;
import com.tableManager.tableManager.model.DataTable;
import com.tableManager.tableManager.model.Row;
import com.tableManager.tableManager.service.RowService;
import com.tableManager.tableManager.service.TableService;
import com.tableManager.tableManager.service.impl.CellServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tables/{rowId}/cells")
@CrossOrigin("*")
public class CellController {

    private final CellServiceImpl cellService;
    private final RowService rowService;
    private final TableService tableService;
    private final UserServiceImpl userServiceImpl;

    public CellController(CellServiceImpl cellService, RowService rowService, TableService tableService, UserServiceImpl userServiceImpl) {
        this.cellService = cellService;
        this.rowService = rowService;
        this.tableService = tableService;
        this.userServiceImpl = userServiceImpl;
    }


    @PostMapping
    public ResponseEntity<Cell> createCell(@PathVariable("rowId") Long rowId, @RequestBody Cell cell) {
        Row row = rowService.findById(rowId);
        Optional<DataTable> table = tableService.getTableById(row.getDataTable().getId());
        Long userID = userServiceImpl.getCurrentUserId();

        try {
            if(table.isPresent() && table.get().getUser().getId().equals(userID)) {
                cellService.createCell(rowId, cell);
                return new ResponseEntity<>(HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{cellId}")
    public ResponseEntity<Cell> getCell(@PathVariable("rowId") Long rowId, @PathVariable("cellId") Long cellId) {
        Row row = rowService.findById(rowId);
        DataTable dataTable = row.getDataTable();
        Long userID = userServiceImpl.getCurrentUserId();

        if(dataTable.getUser().getId().equals(userID)) {


            Optional<Cell> cell = cellService.getCellById(cellId);
            return new ResponseEntity<>(cell.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }


    @GetMapping
    public ResponseEntity<List<Cell>> getCells(@PathVariable("rowId") Long rowId) {
        Row row = rowService.findById(rowId);
        DataTable dataTable = row.getDataTable();
        Long userID = userServiceImpl.getCurrentUserId();

        if (dataTable.getUser().getId().equals(userID)) {
            List<Cell> cellByRowId = cellService.getCellsByRowId(rowId);
            return new ResponseEntity<>(cellByRowId, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }


    @PutMapping("/{cellId}")
    public ResponseEntity<Cell> updateCell(@PathVariable("rowId") Long rowId, @PathVariable Long cellId, @RequestBody Cell newCellData) {



        try {
                cellService.updateCell(cellId, newCellData, rowId);
                return new ResponseEntity<>(HttpStatus.OK);
        
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @DeleteMapping("/{cellId}")
    public ResponseEntity<?> deleteCell(@PathVariable Long cellId, @PathVariable Long rowId) {
        Row row = rowService.findById(rowId);
        Optional<DataTable> table = tableService.getTableById(row.getDataTable().getId());
        Long userID = userServiceImpl.getCurrentUserId();

        if(table.isPresent() && table.get().getUser().getId().equals(userID)) {
            cellService.deleteCell(cellId);
            return ResponseEntity.ok().build();
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}