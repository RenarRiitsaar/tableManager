package com.tableManager.tableManager.security;

import com.tableManager.tableManager.security.dao.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";

    @Autowired
    private JwtAuthEntryPoint authEntryPoint;

    @Bean
    UserDetailsService userDetailsService (){
        return new UserDetailsServiceImpl();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    DaoAuthenticationProvider daoAuthenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http.authorizeHttpRequests((auth) -> auth.requestMatchers("/api/auth/**").permitAll()
               .requestMatchers(HttpMethod.GET)
               .permitAll()
               .requestMatchers(HttpMethod.POST)
               .permitAll()
               .requestMatchers(HttpMethod.PUT)
               .permitAll()
               .requestMatchers(HttpMethod.DELETE)
               .permitAll()
               .requestMatchers("/api/entry/**").hasAnyAuthority(ADMIN,USER)
               .requestMatchers(HttpMethod.GET)
               .permitAll()
               .requestMatchers(HttpMethod.POST)
               .permitAll()
               .requestMatchers(HttpMethod.PUT)
               .permitAll()
               .requestMatchers(HttpMethod.DELETE)
               .permitAll()
               .anyRequest().authenticated());

       http.exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint));
       http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
       http.csrf(AbstractHttpConfigurer::disable);
       return http.build();
    }
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .requestMatchers("/api/entry/**").hasAnyAuthority("USER")
//                        .requestMatchers("/**").hasAnyAuthority("ADMIN")
//                        .anyRequest().authenticated())
//                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//        http.exceptionHandling((exceptions) -> exceptions.authenticationEntryPoint(authEntryPoint));
//
//        return http.build();
//    }
    }

