package com.tableManager.tableManager.service;

import com.tableManager.tableManager.model.Sales;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SalesService {
    List<Sales> getSalesByUserId(Long currentUserId);

    void saveSale(Sales sales);

    void deleteSale(Long id);
}
