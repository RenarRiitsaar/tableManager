package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.DataTable;
import com.tableManager.tableManager.model.Row;
import com.tableManager.tableManager.repository.RowRepository;
import com.tableManager.tableManager.repository.TableRepository;
import com.tableManager.tableManager.service.RowService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RowServiceImpl implements RowService {
    private final RowRepository rowRepository;
    private final TableRepository tableRepository;

    public RowServiceImpl(RowRepository rowRepository, TableRepository tableRepository) {
        this.rowRepository = rowRepository;
        this.tableRepository = tableRepository;
    }

    @Override
    public List<Row> getRowsByTableId(Long tableId, Long userId) {
        Optional<DataTable> table = tableRepository.findById(tableId);

        if (table.isPresent() && table.get().getUser().getId().equals(userId)) {
            return rowRepository.findByDataTableId(tableId);
        }else{
            return null;
        }

    }

    @Override
    public Row createRow(Long tableId, Row row, Long userId) {

        Optional<DataTable> table = tableRepository.findById(tableId);
        if (table.isPresent() && table.get().getUser().getId().equals(userId)) {
            row.setDataTable(table.get());
            return rowRepository.save(row);
        } else {
            throw new RuntimeException("Row not found");
        }
    }

    @Override
    public void deleteById(Long rowId, Long userId) {

        Optional<Row> row = rowRepository.findById(rowId);
        if (row.isPresent() && row.get().getDataTable().getUser().getId().equals(userId)) {

            row.ifPresent(rowRepository::delete);
        }
    }

    @Override
    public Row findById(Long rowId) {
        return rowRepository.findById(rowId).orElse(null);
    }
}