package com.tableManager.tableManager.repository;


import com.tableManager.tableManager.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {

    List<Entry> findByUserId(Long userId);
}
