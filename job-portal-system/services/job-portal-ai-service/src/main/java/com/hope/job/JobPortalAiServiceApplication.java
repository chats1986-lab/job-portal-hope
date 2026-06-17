package com.hope.job;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class JobPortalAiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobPortalAiServiceApplication.class, args);
	}

}
