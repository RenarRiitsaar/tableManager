package com.tableManager.tableManager.service.impl;

import com.tableManager.tableManager.model.VacationRequest;
import com.tableManager.tableManager.repository.VacationRequestRepository;
import com.tableManager.tableManager.service.VacationRequestService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class VacationRequestServiceImpl implements VacationRequestService {
    private final VacationRequestRepository vrRepository;

    public VacationRequestServiceImpl(VacationRequestRepository vrRepository) {
        this.vrRepository = vrRepository;
    }

    @Override
    public List<VacationRequest> getAllRequests() {
        return vrRepository.findAll();
    }

    @Override
    public VacationRequest getRequestById(Long id) {
        if(vrRepository.findById(id).isPresent()) {
            return vrRepository.findById(id).get();
        }else{
            return null;
        }
    }

    @Override
    public void createRequest(VacationRequest request, Long userId) {
        request.setUserId(userId);
        vrRepository.save(request);

    }

    @Override
    public void updateRequest(VacationRequest request) {
        VacationRequest vr = vrRepository.findById(request.getId()).orElse(null);
        if(vr != null) {
            vr.setStartDate(request.getStartDate());
            vr.setEndDate(request.getEndDate());
            vr.setComment(request.getComment());
            vr.setEmployeeId(request.getEmployeeId());
            vr.setVacationType(request.getVacationType());
            vrRepository.save(vr);
        }


    }

    @Override
    public void deleteRequest(VacationRequest request) {
        vrRepository.delete(request);

    }

    @Override
    public int calculateUsedVacation(Long id, int year) {
        int dayCount = 0;

        List<VacationRequest> requests = vrRepository.findAll();
        Map<Integer, Integer> vacationDaysByYear = new HashMap<>();


        for (VacationRequest request : requests) {
            if (Objects.equals(request.getVacationType(), "main")) {
                if (Objects.equals(request.getEmployeeId(), id)) {
                    LocalDate startDate = request.getStartDate();
                    LocalDate endDate = request.getEndDate();

                    if (startDate.getYear() == year) {
                        int days = (int) DAYS.between(startDate, endDate) + 1;
                        dayCount += days;
                    }
                }
            }
        }

        vacationDaysByYear.put(year, dayCount);
        return vacationDaysByYear.getOrDefault(year, 0);
    }

    @Override
    public boolean checkVacationRequest(VacationRequest request) {
        int usedDays = calculateUsedVacation(request.getEmployeeId(), request.getStartDate().getYear());
        int requestedDays =(int) DAYS.between(request.getStartDate(), request.getEndDate()) +1;
        int sumOfDays = usedDays + requestedDays;

        //return request.getStartDate().isAfter(LocalDate.now().plusDays(14)) &&
        //                 request.getEndDate().isAfter(request.getStartDate())
        //                && sumOfDays <= 28;                           // 14 day announcement return

        return request.getEndDate().isAfter(request.getStartDate())
                && sumOfDays <= 28;
    }
}
