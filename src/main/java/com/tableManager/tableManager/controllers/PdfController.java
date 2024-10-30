package com.tableManager.tableManager.controllers;


import com.tableManager.tableManager.model.PdfSettings;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.service.impl.PdfServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin("*")
public class PdfController {

    private final PdfServiceImpl pdfService;
    private final UserServiceImpl userService;
    private static final String UPLOAD_DIR = "/data01/virt131441/domeenid/www.tablemanager.ee/logos/";
    private static final String DIR_PREFIX = "/data01/virt131441/domeenid/www.tablemanager.ee";

    public PdfController(PdfServiceImpl pdfService, UserServiceImpl userService) {
        this.pdfService = pdfService;
        this.userService = userService;
    }


    @GetMapping("/base64")
    public ResponseEntity<String> getImage() throws IOException {
        Long currentUserId = userService.getCurrentUserId();
        PdfSettings pdfSettings = pdfService.getPdfByUserId(currentUserId);

        if (pdfSettings == null || pdfSettings.getLogoURL() == null) {
            return ResponseEntity.notFound().build();
        }

        String logoURL = pdfSettings.getLogoURL();
        String path = DIR_PREFIX + logoURL;



        byte[] imageBytes = Files.readAllBytes(Path.of(path));
        String base64 = Base64.getEncoder().encodeToString(imageBytes);

        return ResponseEntity.ok(base64);
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> upload(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "File is empty"));
            }
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/png") && !contentType.equals("image/jpeg"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type. Only PNG and JPG files are allowed.");
            }

            String filename = file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            String fileUrl = "src/logos/" + filename;
            return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to upload file"));
        }
    }

    @GetMapping("/getPdfSettings")
    public ResponseEntity<PdfSettings> getPdfSettings() {
        Long currentUserId = userService.getCurrentUserId();
        User user = userService.findbyId(currentUserId);

        if (currentUserId != null && user.isEnabled()) {
            PdfSettings pdfSettings = pdfService.getPdfByUserId(currentUserId);
            return ResponseEntity.ok(pdfSettings);
        } else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/addPdfSettings")
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
    @PutMapping("/updatePdfSettings")
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
    @DeleteMapping("/deletePdfSettings")
    public ResponseEntity<?> deletePdfSettings(){
        Long currentUserId = userService.getCurrentUserId();
        User user = userService.findbyId(currentUserId);
        if (currentUserId != null && user.isEnabled()) {

            String filename = pdfService.getFilename(currentUserId);
            Path path = Path.of(DIR_PREFIX + filename);

            try{
                Files.delete(path);
            }catch (IOException e){
                e.printStackTrace();
            }

            if(!Files.exists(path)) {
                pdfService.deletePDF(currentUserId);
            }

            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
