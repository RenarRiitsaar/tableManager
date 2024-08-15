package com.tableManager.tableManager.service;

import com.tableManager.tableManager.model.PdfSettings;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PdfService {
    PdfSettings getPdfByUserId(Long currentUserId);

    PdfSettings createPDF(PdfSettings pdfSettings, Long currentUserId);

    boolean checkPdfExistance(Long userId);

    PdfSettings updatePDF(PdfSettings pdfSettings, Long currentUserId);

    void deletePDF(Long currentUserId);

    String getFilename(Long currentUserId);
}
