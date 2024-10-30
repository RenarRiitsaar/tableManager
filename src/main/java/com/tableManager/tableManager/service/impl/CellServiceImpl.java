package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.Cell;
import com.tableManager.tableManager.model.Row;
import com.tableManager.tableManager.repository.CellRepository;
import com.tableManager.tableManager.repository.RowRepository;
import com.tableManager.tableManager.service.CellService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CellServiceImpl implements CellService {

    private final CellRepository cellRepository;
    private final RowRepository rowRepository;

    public CellServiceImpl(CellRepository cellRepository, RowRepository rowRepository) {
        this.cellRepository = cellRepository;
        this.rowRepository = rowRepository;
    }

    @Override
    public Cell createCell(Long rowId, Cell cell) {
        Optional<Row> row = rowRepository.findById(rowId);
        Cell newCell = new Cell();

        if (row.isPresent()) {
            newCell.setRow(row.get());
            newCell.setValue(cell.getValue());
            newCell.setDataType(cell.getDataType());
            newCell.setId(cell.getId());
            return cellRepository.save(newCell);
        } else {
            throw new RuntimeException("Row not found");
        }
    }

    @Override
    public List<Cell> getCellsByRowId(Long rowId) {
        return cellRepository.findByRowId(rowId);
    }

    @Override
    public Optional<Cell> getCellById(Long id) {
        return cellRepository.findById(id);
    }
    @Override
    public Cell updateCell(Long id, Cell newCellData, Long rowId) {
        return cellRepository.findById(id).map(cell -> {
            cell.setValue(newCellData.getValue());
            cell.setDataType(newCellData.getDataType());
            return cellRepository.save(cell);
        }).orElseThrow(() -> new RuntimeException("Cell not found"));
    }

    @Override
    public void deleteCell(Long id) {
        cellRepository.deleteById(id);
    }
}