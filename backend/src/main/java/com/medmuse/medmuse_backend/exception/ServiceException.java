package com.medmuse.medmuse_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class ServiceException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final String operation;
    private final String message;

    public ServiceException(String operation, String message, Throwable cause) {
        super(String.format("Operation '%s' failed: %s", operation, message), cause);
        this.operation = operation;
        this.message = message;
    }

    public ServiceException(String operation, String message) {
        this(operation, message, null);
    }

    public String getOperation() {
        return operation;
    }

    @Override
    public String getMessage() {
        return message;
    }
}