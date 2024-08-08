package com.tableManager.tableManager.service.impl;


import com.tableManager.tableManager.model.PdfSettings;
import com.tableManager.tableManager.repository.PdfRepository;
import com.tableManager.tableManager.service.PdfService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class PdfServiceImpl implements PdfService {

    private final PdfRepository pdfRepository;

    public PdfServiceImpl(PdfRepository pdfRepository) {
        this.pdfRepository = pdfRepository;
    }

    @Override
    public PdfSettings getPdfByUserId(Long currentUserId) {
        return pdfRepository.findByUserId(currentUserId);

    }

    @Override
    public PdfSettings createPDF(PdfSettings pdfSettings, Long currentUserId) {

        PdfSettings createPDF = new PdfSettings();
        createPDF.setId(pdfSettings.getId());
        createPDF.setLogoURL(pdfSettings.getLogoURL());
        createPDF.setCompanyName(pdfSettings.getCompanyName());
        createPDF.setCompanyAddress(pdfSettings.getCompanyAddress());
        createPDF.setCompanyCity(pdfSettings.getCompanyCity());
        createPDF.setCompanyPhone(pdfSettings.getCompanyPhone());
        createPDF.setCompanyEmail(pdfSettings.getCompanyEmail());
        createPDF.setBankDetails(pdfSettings.getBankDetails());
        createPDF.setUserId(currentUserId);

        pdfRepository.save(createPDF);

        return createPDF;
    }

    @Override
    public boolean checkPdfExistance(Long userId) {
        List<PdfSettings> allPDFs = pdfRepository.findAll();
        List<PdfSettings> foundPDFs = new ArrayList<>();

        for(PdfSettings pdf : allPDFs) {
            if(Objects.equals(pdf.getUserId(), userId)) {
                foundPDFs.add(pdf);
            }
        }

        return foundPDFs.isEmpty();
    }

    @Override
    public PdfSettings updatePDF(PdfSettings pdfSettings, Long currentUserId) {
        PdfSettings existingPDF = pdfRepository.findByUserId(currentUserId);

        if (pdfSettings.getLogoURL() != null) {
            existingPDF.setLogoURL(pdfSettings.getLogoURL());
        }
        if (pdfSettings.getCompanyName() != null) {
            existingPDF.setCompanyName(pdfSettings.getCompanyName());
        }
        if (pdfSettings.getCompanyAddress() != null) {
            existingPDF.setCompanyAddress(pdfSettings.getCompanyAddress());
        }
        if (pdfSettings.getCompanyCity() != null) {
            existingPDF.setCompanyCity(pdfSettings.getCompanyCity());
        }
        if (pdfSettings.getCompanyPhone() != null) {
        existingPDF.setCompanyPhone(pdfSettings.getCompanyPhone());
    }
        if (pdfSettings.getCompanyEmail() != null) {
            existingPDF.setCompanyEmail(pdfSettings.getCompanyEmail());
        }
        if (pdfSettings.getBankDetails() != null) {
            existingPDF.setBankDetails(pdfSettings.getBankDetails());
        }

        pdfRepository.save(existingPDF);
        return existingPDF;
    }

    @Override
    public void deletePDF(Long currentUserId) {
        PdfSettings pdf = pdfRepository.findByUserId(currentUserId);
        pdfRepository.delete(pdf);
    }
}
