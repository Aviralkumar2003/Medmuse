package com.medmuse.medmuse_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FileOperationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final String operation;
    private final String filePath;

    public FileOperationException(String operation, String filePath, Throwable cause) {
        super(String.format("File operation '%s' failed for file: %s", operation, filePath), cause);
        this.operation = operation;
        this.filePath = filePath;
    }

    public String getOperation() {
        return operation;
    }

    public String getFilePath() {
        return filePath;
    }
}