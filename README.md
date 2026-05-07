# Tano Digital - Microsoft Entra ID OAuth Demo

This project demonstrates a full-stack integration with Microsoft Entra ID (formerly Azure AD) using a Spring Boot backend and a Next.js frontend.

## 🏗 Architecture Overview

This project uses **Option A: Next.js → Spring Boot → Microsoft Login → Graph → Dashboard**.

1. **Next.js Frontend (Client)**: Acts as the presentation layer. It does not handle any tokens directly. It triggers the login flow by redirecting the user to the Spring Boot backend's OAuth2 authorization endpoint.
2. **Spring Boot Backend (Resource Server / Client)**: Acts as the OAuth2 Confidential Client. It securely handles the client ID and client secret, initiates the Authorization Code Flow with Microsoft Entra ID, and exchanges the authorization code for an Access Token and an ID Token.
3. **Microsoft Entra ID (Authorization Server)**: Authenticates the user and issues tokens.
4. **Microsoft Graph API**: The Spring Boot backend uses the obtained Access Token to query the `/me` endpoint to retrieve user details (like job title and department) that are not always present in the standard ID token.
5. **Session Management**: After successful authentication, Spring Boot creates an HTTP-Only session cookie (`JSESSIONID`). The Next.js frontend uses this cookie (`credentials: 'include'`) to securely communicate with the backend.

## 🔐 Security Model

*   **Authorization Code Flow**: We use the most secure OAuth2 flow suitable for server-side applications.
*   **Tenant-Restricted Authority**: The authority URL is locked to `https://login.microsoftonline.com/{TENANT_ID}`, meaning only users from your specific tenant can even attempt to authenticate. We are **not** using the `/common` endpoint.
*   **Domain Validation**: During the authentication success callback in `SecurityConfig.java`, the backend explicitly checks the user's email domain. If it does not end with `@tanodigitalgroup.com`, an exception is thrown, and the login fails.
*   **No Client Secrets in Frontend**: The Next.js app never sees the Microsoft Client Secret or the Access/ID tokens, eliminating the risk of XSS attacks stealing them.
*   **HTTP-Only Cookies**: Cross-Origin communication is secured via HTTP-Only session cookies and tightly controlled CORS settings.

---

## 🔧 Azure Setup Instructions

Follow these steps to register your application in Microsoft Entra ID:

1.  **Register the App**:
    *   Go to the [Azure Portal](https://portal.azure.com/) -> **Microsoft Entra ID**.
    *   Click on **App registrations** -> **New registration**.
    *   Name: `Tano Digital Demo`.
    *   Supported account types: Select **Accounts in this organizational directory only (Default Directory only - Single tenant)**.
    *   Redirect URI: Select **Web** and enter `http://localhost:8080/login/oauth2/code/microsoft`.
    *   Click **Register**.

2.  **Get IDs**:
    *   Once registered, copy the **Application (client) ID** and the **Directory (tenant) ID** from the Overview page.

3.  **Create a Client Secret**:
    *   Go to **Certificates & secrets** in the left menu.
    *   Click **New client secret**.
    *   Add a description and set an expiration.
    *   Copy the **Value** of the generated secret immediately (you won't be able to see it again).

4.  **Add API Permissions**:
    *   Go to **API permissions**.
    *   Click **Add a permission** -> **Microsoft Graph** -> **Delegated permissions**.
    *   Search for and check the following permissions:
        *   `openid`
        *   `profile`
        *   `email`
        *   `User.Read`
    *   Click **Add permissions**.

5.  **Grant Admin Consent**:
    *   On the API permissions page, click the **Grant admin consent for [Your Directory]** button and confirm. This is required so users don't have to individually consent to sharing their profile data.

---

## 💻 Running the Project

### 1. Setup Environment Variables

In the `backend` folder, update the `.env` file and fill in the values you obtained from Azure:

```env
MICROSOFT_CLIENT_ID=your_client_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_here
MICROSOFT_TENANT_ID=your_tenant_id_here
FRONTEND_URL=http://localhost:3000
```

In the `frontend` folder, a `.env.local` has been created with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Start the Backend (Spring Boot)

Open a terminal, navigate to the `backend` directory, and run:

```bash
cd backend
./mvnw spring-boot:run
```
*(If you don't have the maven wrapper, use `mvn spring-boot:run`)*. The backend will start on `http://localhost:8080`.

### 3. Start the Frontend (Next.js)

Open another terminal, navigate to the `frontend` directory, and run:

```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`.

---

## 🧪 Testing Instructions

1.  **Navigate to the app**: Open your browser and go to `http://localhost:3000`. You will be redirected to the login page.
2.  **Login**: Click "Sign in with Microsoft". This redirects you to `http://localhost:8080/oauth2/authorization/microsoft` which forwards you to the Microsoft login screen.
3.  **Authenticate**: Log in using an account that belongs to your tenant and has an `@tanodigitalgroup.com` email address.
4.  **Dashboard**: Upon successful login, you will be redirected back to `http://localhost:3000/dashboard`.
5.  **View Data**: The dashboard will securely fetch `/api/me` and display your Full Name, Email, Job Title, and Department.

### Expected JSON Response from `/api/me`

If you manually navigate to `http://localhost:8080/api/me` after logging in, you should see:

```json
{
  "fullName": "John Doe",
  "email": "john.doe@tanodigitalgroup.com",
  "jobTitle": "Senior Software Engineer",
  "department": "Engineering",
  "userPrincipalName": "john.doe@tanodigitalgroup.com"
}
```

### Common Errors & Fixes

*   **`invalid_domain` error on login**: You logged in with an email that does not end in `@tanodigitalgroup.com`. The backend rejected it.
*   **`401 Unauthorized` on Dashboard**: The Next.js app failed to send the `JSESSIONID` cookie. Ensure `credentials: "include"` is set in the `fetch()` call.
*   **Missing Job Title / Department**: The user in Entra ID does not have these fields populated. Go to the Azure Portal -> Users -> Edit Properties to add them.
*   **`AADSTS7000215: Invalid client secret provided.`**: The secret in your `.env` file is incorrect or expired.
