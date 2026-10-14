package com.campus.lostfound.service;

import com.campus.lostfound.dto.AuthResponse;
import com.campus.lostfound.dto.LoginRequest;
import com.campus.lostfound.dto.RegisterRequest;
import com.campus.lostfound.entity.User;
import com.campus.lostfound.entity.enums.Role;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.repository.UserRepository;
import com.campus.lostfound.security.CustomUserDetails;
import com.campus.lostfound.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Alex Student")
                .email("alex@campus.edu")
                .password("encoded_password")
                .role(Role.STUDENT)
                .build();
    }

    @Test
    @DisplayName("Should successfully register user and return JWT token")
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("Alex Student", "alex@campus.edu", "password123", Role.STUDENT);

        when(userRepository.existsByEmail("alex@campus.edu")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("sample_jwt_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("sample_jwt_token", response.getToken());
        assertEquals("alex@campus.edu", response.getEmail());
        assertEquals("Bearer", response.getType());
    }

    @Test
    @DisplayName("Should throw BadRequestException when email is already registered")
    void shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Alex Student", "alex@campus.edu", "password123", Role.STUDENT);

        when(userRepository.existsByEmail("alex@campus.edu")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login user with valid credentials")
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("alex@campus.edu", "password123");

        Authentication auth = mock(Authentication.class);
        CustomUserDetails userDetails = new CustomUserDetails(sampleUser);
        when(auth.getPrincipal()).thenReturn(userDetails);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("login_jwt_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("login_jwt_token", response.getToken());
        assertEquals("alex@campus.edu", response.getEmail());
    }
}
