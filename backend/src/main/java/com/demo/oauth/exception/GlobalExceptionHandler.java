package com.demo.oauth.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(OAuth2AuthenticationException.class)
    public ProblemDetail handleOAuth2AuthenticationException(OAuth2AuthenticationException ex) {
        log.error("OAuth2 Authentication Error: {}", ex.getMessage());
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(WebClientResponseException.class)
    public ProblemDetail handleWebClientResponseException(WebClientResponseException ex) {
        log.error("WebClient Error when communicating with external API: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
        return ProblemDetail.forStatusAndDetail(ex.getStatusCode(), "Error communicating with upstream service.");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        log.error("Unhandled Exception: ", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
    }
}
