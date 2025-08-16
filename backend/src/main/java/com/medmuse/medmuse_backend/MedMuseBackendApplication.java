package com.medmuse.medmuse_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MedMuseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedMuseBackendApplication.class, args);
	}

}
