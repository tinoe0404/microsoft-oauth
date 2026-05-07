package com.demo.oauth.service;

import com.demo.oauth.dto.GraphUserResponse;
import com.demo.oauth.dto.UserDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Service
public class GraphService {

    private final WebClient graphWebClient;

    public GraphService(WebClient graphWebClient) {
        this.graphWebClient = graphWebClient;
    }

    public UserDTO getUserProfile() {
        log.info("Fetching user profile from Microsoft Graph API...");
        
        GraphUserResponse response = graphWebClient.get()
                .uri("/me?$select=displayName,mail,jobTitle,department,userPrincipalName")
                .attributes(org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction.clientRegistrationId("microsoft"))
                .retrieve()
                .bodyToMono(GraphUserResponse.class)
                .block();

        if (response == null) {
            log.warn("Graph API returned a null response");
            return null;
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setFullName(response.displayName());
        userDTO.setEmail(response.mail());
        userDTO.setJobTitle(response.jobTitle());
        userDTO.setDepartment(response.department());
        userDTO.setUserPrincipalName(response.userPrincipalName());
        
        log.info("Successfully fetched user profile for: {}", userDTO.getUserPrincipalName());
        return userDTO;
    }
}
