package com.tableManager.tableManager.controllers;


import com.tableManager.tableManager.model.PdfSettings;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.service.PdfService;
import com.tableManager.tableManager.service.UserService;
import com.tableManager.tableManager.service.impl.PdfServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin("*")
public class PdfController {

    private final PdfServiceImpl pdfService;
    private final UserServiceImpl userService;

    public PdfController(PdfServiceImpl pdfService, UserServiceImpl userService) {
        this.pdfService = pdfService;
        this.userService = userService;
    }

    @GetMapping("/getPDFSettings/{userId}")
    public ResponseEntity<PdfSettings> getPdfSettings(@PathVariable Long userId) {
        Long currentUserId = userService.getCurrentUserId();
        User user = userService.findbyId(currentUserId);

        if (currentUserId != null && currentUserId.equals(userId) && user.isEnabled()) {
            PdfSettings pdfSettings = pdfService.getPdfByUserId(currentUserId);
            return ResponseEntity.ok(pdfSettings);
        } else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/postPDFSettings")
    public ResponseEntity<PdfSettings> postPdfSettings(@RequestBody PdfSettings pdfSettings) {
        Long currentUserId = userService.getCurrentUserId();
        User user = userService.findbyId(currentUserId);


        if (currentUserId != null && user.isEnabled() && pdfService.checkPdfExistance(user.getId())) {
            PdfSettings createPDF = pdfService.createPDF(pdfSettings, currentUserId);
            return ResponseEntity.ok(createPDF);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @PutMapping("/updatePDFSettings")
    public ResponseEntity<PdfSettings> updatePdfSettings(@RequestBody PdfSettings pdfSettings) {
        Long currentUserId = userService.getCurrentUserId();
        User user = userService.findbyId(currentUserId);

        if (currentUserId != null && user.isEnabled() && !pdfService.checkPdfExistance(currentUserId)) {

            PdfSettings updatePDF = pdfService.updatePDF(pdfSettings, currentUserId);
            return ResponseEntity.ok(updatePDF);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @DeleteMapping("/deletePDFSettings")
    public ResponseEntity<?> deletePdfSettings(){
        Long currentUserId = userService.getCurrentUserId();
        User user = userService.findbyId(currentUserId);
        if (currentUserId != null && user.isEnabled()) {
            pdfService.deletePDF(currentUserId);
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
