package com.medmuse.medmuse_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final String message;
    private final String resource;

    public UnauthorizedException(String message, String resource) {
        super(String.format("%s: %s", message, resource));
        this.message = message;
        this.resource = resource;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public String getResource() {
        return resource;
    }
}