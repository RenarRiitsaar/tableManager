package com.tableManager.tableManager.service;

import com.tableManager.tableManager.model.DataTable;
import com.tableManager.tableManager.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface TableService {

    void createTable(DataTable table, User user);

    List<DataTable> getAllTables();

    Optional<DataTable> getTableById(Long id);

    DataTable updateTable(Long id, DataTable newTableData);

    void deleteTable(Long id);
}