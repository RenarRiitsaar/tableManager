package com.tableManager.tableManager.exceptions;

public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String message){
      super(message);
    }
}
