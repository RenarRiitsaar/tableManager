package com.tableManager.tableManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;

@SpringBootApplication
public class TableManagerApplication {


	public static void main(String[] args) {
		SpringApplication.run(TableManagerApplication.class, args);
	}

}

