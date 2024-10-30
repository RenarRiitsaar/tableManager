package com.tableManager.tableManager.controllers;


import com.tableManager.tableManager.model.Sales;
import com.tableManager.tableManager.service.impl.SalesServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales")
public class SalesController {
    private final UserServiceImpl userService;
    private final SalesServiceImpl salesService;
    private String BASE_UPLOAD_DIR = "/data01/virt131441/domeenid/www.tablemanager.ee/clientSales/";

    public SalesController(UserServiceImpl userService, SalesServiceImpl salesService) {
        this.userService = userService;
        this.salesService = salesService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Sales>> getAllSales() {
        Long currentUserId = userService.getCurrentUserId();

        if (currentUserId != null) {
            List<Sales> salesList = salesService.getSalesByUserId(currentUserId);
            return new ResponseEntity<>(salesList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/saveSale")
    public ResponseEntity<Sales> saveSale(@RequestBody Sales sales) {

        Long currentUserId = userService.getCurrentUserId();

        if (currentUserId != null) {
            sales.setUserId(currentUserId);
            salesService.saveSale(sales);
            return new ResponseEntity<>(sales, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/deleteSale")
    public ResponseEntity<Sales> deleteSale(@RequestBody Sales sales) {
        Long currentUserId = userService.getCurrentUserId();
        if (currentUserId != null) {
            salesService.deleteSale(sales.getId());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam MultipartFile file, @RequestParam Long id) {
        try {
            String clientDirPath = BASE_UPLOAD_DIR + id;
            Path clientDir = Paths.get(clientDirPath);

            if (!Files.exists(clientDir)) {
                Files.createDirectories(clientDir);
            }
            Path filePath = clientDir.resolve(file.getOriginalFilename());
            file.transferTo(filePath.toFile());
            Map<String, String> res = new HashMap<>();
            res.put("filePath", filePath.toString());

            return new ResponseEntity<>(res, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/download/{id}/{filename}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable("filename") String filename, @PathVariable Long id) throws IOException {

        if (Files.exists(Paths.get(BASE_UPLOAD_DIR + id + "/" + filename))) {

            InputStream inputStream = new FileInputStream(BASE_UPLOAD_DIR + id + "/" + filename);
            InputStreamResource resource = new InputStreamResource(inputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");

            return new ResponseEntity<>(resource, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }


