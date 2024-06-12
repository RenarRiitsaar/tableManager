package com.tableManager.tableManager.service;

import com.tableManager.tableManager.model.Entry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EntryService {
    List<Entry> findAllEntries();

    List<Entry> findEntriesByUserId(Long userId);

    Entry addEntry(Long userId, Entry entry);

    void deleteEntry(Long userId, Long entryId);

    Entry updateEntry(Long userId, Long entryId, Entry entry);
}
