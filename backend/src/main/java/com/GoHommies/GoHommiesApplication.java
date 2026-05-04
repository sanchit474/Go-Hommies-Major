package com.GoHommies;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // Add this annotation
public class GoHommiesApplication {

	public static void main(String[] args) {
		SpringApplication.run(GoHommiesApplication.class, args);
	}

}
