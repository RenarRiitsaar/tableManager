package com.tableManager.tableManager.service;

import com.tableManager.tableManager.model.Row;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RowService {

    List<Row> getRowsByTableId(Long tableId, Long userId);

    Row createRow(Long tableId, Row row, Long userId);

    void deleteById(Long rowId, Long userId);

    Row findById(Long rowId);
}