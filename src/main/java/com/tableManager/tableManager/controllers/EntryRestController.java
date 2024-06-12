package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.Entry;
import com.tableManager.tableManager.service.impl.EntryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class EntryRestController {

    @Autowired
    private EntryServiceImpl entryService;


    @GetMapping("/{userId}/entries")
    public ResponseEntity<List<Entry>> getEntries(@PathVariable Long userId) {
        List<Entry> entries = entryService.findEntriesByUserId(userId);
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }
    @PostMapping("/{userId}/addEntry")
    public ResponseEntity<Entry> addEntry(@PathVariable Long userId, @RequestBody Entry entry) {
        Entry newEntry = entryService.addEntry(userId, entry);
        return new ResponseEntity<>(newEntry, HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}/deleteEntry/{entryId}")
    public ResponseEntity<Entry> deleteEntry(@PathVariable Long userId, @PathVariable Long entryId) {
        entryService.deleteEntry(userId,entryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{userId}/updateEntry/{entryId}")
    public ResponseEntity<Entry> updateEntry(@PathVariable Long userId, @PathVariable Long entryId, @RequestBody Entry entry) {
        Entry updatedEntry = entryService.updateEntry(userId, entryId, entry);
        return new ResponseEntity<>(updatedEntry, HttpStatus.OK);
    }
}
