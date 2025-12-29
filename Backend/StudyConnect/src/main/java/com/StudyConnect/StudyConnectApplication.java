package com.StudyConnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "*")
public class StudyConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudyConnectApplication.class, args);
	}

}
