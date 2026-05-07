package com.demo.oauth.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String fullName;
    private String email;
    private String jobTitle;
    private String department;
    private String userPrincipalName;
}
