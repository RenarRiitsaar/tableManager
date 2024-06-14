package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.Entry;
import com.tableManager.tableManager.service.impl.EntryServiceImpl;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("api/entry")
public class EntryRestController {

    @Autowired
    private EntryServiceImpl entryService;
    @Autowired
    private UserServiceImpl userService;


    @GetMapping("/entries")
    //@PreAuthorize("#userId == @userServiceImpl.getCurrentUserId()")
    public ResponseEntity<List<Entry>> getEntries() {
        Long currentUserId =userService.getCurrentUserId();
        if(currentUserId != null) {
            List<Entry> entries = entryService.findEntriesByUserId(currentUserId);
            return new ResponseEntity<>(entries, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/addEntry")
    //@PreAuthorize("#userId == @userServiceImpl.getCurrentUserId()")
    public ResponseEntity<Entry> addEntry( @RequestBody Entry entry) {
        Long currentUserId = userService.getCurrentUserId();

        if(currentUserId != null) {
            Entry newEntry = entryService.addEntry(currentUserId, entry);
            return new ResponseEntity<>(newEntry, HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        }

    @DeleteMapping("/deleteEntry/{entryId}")
    //@PreAuthorize("#userId == @userServiceImpl.getCurrentUserId()")
    public ResponseEntity<Entry> deleteEntry(@PathVariable Long entryId) {
        Long currentUserId = userService.getCurrentUserId();

        if(currentUserId != null) {
            entryService.deleteEntry(currentUserId, entryId);
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/updateEntry/{entryId}")
    //PreAuthorize("#userId == @userServiceImpl.getCurrentUserId()")
    public ResponseEntity<Entry> updateEntry( @PathVariable Long entryId, @RequestBody Entry entry) {
        Long currentUserId = userService.getCurrentUserId();

        if(currentUserId != null) {

            Entry updatedEntry = entryService.updateEntry(currentUserId, entryId, entry);
            return new ResponseEntity<>(updatedEntry, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
