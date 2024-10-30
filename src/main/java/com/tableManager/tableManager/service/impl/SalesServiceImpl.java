package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.Sales;
import com.tableManager.tableManager.repository.SalesRepository;
import com.tableManager.tableManager.service.SalesService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SalesServiceImpl implements SalesService {
    private final SalesRepository salesRepository;

    public SalesServiceImpl(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }

    @Override
    public List<Sales> getSalesByUserId(Long currentUserId) {
        List<Sales> findAllSales = salesRepository.findAll();
        List<Sales> userSales = new ArrayList<>();

        for(Sales sales : findAllSales) {
            if(sales.getUserId().equals(currentUserId)) {
                userSales.add(sales);
            }
        }

        return userSales;
    }

    @Override
    public void saveSale(Sales sales) {
        salesRepository.save(sales);
    }

    @Override
    public void deleteSale(Long id) {
        salesRepository.deleteById(id);

    }
}
