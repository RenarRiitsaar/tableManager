package com.tableManager.tableManager.repository;

import com.tableManager.tableManager.model.PdfSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PdfRepository extends JpaRepository<PdfSettings, Long> {
    PdfSettings findByUserId(Long currentUserId);
}
