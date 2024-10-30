package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.DataTable;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.TableRepository;
import com.tableManager.tableManager.service.TableService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TableServiceImpl implements TableService {


    private final TableRepository tableRepository;

    public TableServiceImpl(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    @Override
    public void createTable(DataTable table, User user) {
        table.setUser(user);
        user.getTables().add(table);
        tableRepository.save(table);
    }

    @Override
    public List<DataTable> getAllTables() {

        return tableRepository.findAll();
    }

    @Override
    public Optional<DataTable> getTableById(Long id) {
        return tableRepository.findById(id);
    }

    @Override
    public DataTable updateTable(Long id, DataTable newTableData) {
        return tableRepository.findById(id).map(table -> {
            table.setName(newTableData.getName());
            return tableRepository.save(table);
        }).orElseThrow(() -> new RuntimeException("Table not found"));
    }

    @Override
    public void deleteTable(Long id) {
        tableRepository.deleteById(id);
    }
}