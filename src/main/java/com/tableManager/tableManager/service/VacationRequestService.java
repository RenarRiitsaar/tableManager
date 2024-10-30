package com.tableManager.tableManager.service;


import com.tableManager.tableManager.model.VacationRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VacationRequestService {

    List<VacationRequest> getAllRequests();
    VacationRequest getRequestById(Long id);
    void createRequest(VacationRequest request, Long userId);
    void updateRequest(VacationRequest request);
    void deleteRequest(VacationRequest request);
    int calculateUsedVacation(Long id, int year);
    boolean checkVacationRequest(VacationRequest request);
}
