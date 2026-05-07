package com.demo.oauth.dto;

public record GraphUserResponse(
    String displayName,
    String mail,
    String jobTitle,
    String department,
    String userPrincipalName
) {}
