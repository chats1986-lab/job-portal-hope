package com.hope.job.exception;

public class BusinessException extends BaseException {
    public BusinessException(String message) {
        super(message, 400);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, 400, cause);
    }
}
