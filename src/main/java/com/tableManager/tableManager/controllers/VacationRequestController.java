package com.tableManager.tableManager.controllers;

import com.tableManager.tableManager.model.VacationRequest;
import com.tableManager.tableManager.service.impl.UserServiceImpl;
import com.tableManager.tableManager.service.impl.VacationRequestServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/request")
@CrossOrigin("*")
public class VacationRequestController {
    private final VacationRequestServiceImpl vrService;
    private final UserServiceImpl userService;

    public VacationRequestController(VacationRequestServiceImpl vrService, UserServiceImpl userService) {
        this.vrService = vrService;
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<VacationRequest>> getVacationList(){
        Long currentUserId = userService.getCurrentUserId();
        List<VacationRequest> userRequests = new ArrayList<>();

        for(VacationRequest req: vrService.getAllRequests()){
            if(req.getUserId().equals(currentUserId)){
                userRequests.add(req);
            }
        }

        if(userRequests.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(userRequests, HttpStatus.OK);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacationRequest> getVacationById(@PathVariable Long id){
        Long currentUserId = userService.getCurrentUserId();
        VacationRequest request = vrService.getRequestById(id);

        if(request.getUserId().equals(currentUserId)){
            return new ResponseEntity<>(request, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<VacationRequest> createVacation(@RequestBody VacationRequest vacationRequest){
        Long currentUserId = userService.getCurrentUserId();

        if(vrService.checkVacationRequest(vacationRequest)){
            vrService.createRequest(vacationRequest, currentUserId);
            return new ResponseEntity<>(vacationRequest, HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacationRequest> updateRequest(@PathVariable Long id, @RequestBody VacationRequest vacationRequest){
        Long currentUserId = userService.getCurrentUserId();

        if(vrService.checkVacationRequest(vacationRequest) && vacationRequest.getUserId().equals(currentUserId)){
            vrService.updateRequest(vacationRequest);
            return new ResponseEntity<>(vacationRequest, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VacationRequest> deleteRequest(@PathVariable Long id){
        Long currentUserId = userService.getCurrentUserId();
        VacationRequest request = vrService.getRequestById(id);
        if(request != null && request.getUserId().equals(currentUserId)){
            vrService.deleteRequest(request);
            return new ResponseEntity<>(request, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
