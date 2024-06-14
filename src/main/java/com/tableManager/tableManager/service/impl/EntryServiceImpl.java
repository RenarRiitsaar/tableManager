package com.tableManager.tableManager.service.impl;


import com.tableManager.tableManager.exceptions.ResourceNotFoundException;
import com.tableManager.tableManager.model.Entry;
import com.tableManager.tableManager.model.User;
import com.tableManager.tableManager.repository.EntryRepository;
import com.tableManager.tableManager.repository.UserRepository;
import com.tableManager.tableManager.service.EntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class EntryServiceImpl implements EntryService {

    @Autowired
    private EntryRepository entryRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Entry> findAllEntries() {
        return entryRepository.findAll();
    }

    @Override
    public List<Entry> findEntriesByUserId(Long userId) {

        return entryRepository.findByUserId(userId);
    }

    @Override
    public Entry addEntry(Long userId, Entry entry) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Entry newEntry = new Entry();
        newEntry.setArticleNum(entry.getArticleNum());
        newEntry.setArticleName(entry.getArticleName());
        newEntry.setPriceBeforeTax(entry.getPriceBeforeTax());
        newEntry.setPriceAfterTax((entry.getPriceBeforeTax() / 100 *22) + entry.getPriceBeforeTax());
        newEntry.setInventoryAmount(entry.getInventoryAmount());
        newEntry.setUserId(user.getId());
      return entryRepository.save(newEntry);
    }

    @Override
    public void deleteEntry(Long userId, Long entryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Entry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));

        if(Objects.equals(entry.getUserId(), user.getId())) {
            entryRepository.delete(entry);
        }else{
            throw new ResourceNotFoundException("Could not delete entry with id: " + entryId + ", user mismatch");
        }
    }

    @Override
    public Entry updateEntry(Long userId, Long entryId, Entry entry) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Entry existingEntry = entryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entry not found with id: " + entryId));

        existingEntry.setArticleNum(entry.getArticleNum());
        existingEntry.setArticleName(entry.getArticleName());
        existingEntry.setPriceBeforeTax(entry.getPriceBeforeTax());
        existingEntry.setPriceAfterTax(entry.getPriceAfterTax());
        existingEntry.setInventoryAmount(entry.getInventoryAmount());

        if(!Objects.equals(user.getId(), existingEntry.getUserId())) {
            throw new ResourceNotFoundException("Could not update entry with id: " + entryId + ", user mismatch");
        }
        entryRepository.save(existingEntry);
        return existingEntry;
    }
}
