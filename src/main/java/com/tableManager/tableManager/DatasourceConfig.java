package com.tableManager.tableManager;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatasourceConfig {

    private String SERVER_URL = "jdbc:mysql://d131844.mysql.zonevs.eu:3306/d131844sd569121";
    private String DEV_URL = "jdbc:mysql://localhost:3306/tablemanager";
    private String SERVER_USER = "d131844sa517477";
    private String SERVER_PASSWORD = "8gd9e4ycs32vw";
    private String DEV_USER = "root";
    private String DEV_PASSWORD = "Root";

    @Bean
    public DataSource datasource() {
        return DataSourceBuilder.create()
                .driverClassName("com.mysql.cj.jdbc.Driver")
                .url(SERVER_URL)
                .username(SERVER_USER)
                .password(SERVER_PASSWORD)
                .build();
    }
}