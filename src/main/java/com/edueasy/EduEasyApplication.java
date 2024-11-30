package com.edueasy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EduEasyApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduEasyApplication.class, args);
	}

@Bean
	public CommandLineRunner commandLineRunner() {
	return args -> System.out.println("Aplicação EduEasy foi iniciada com sucesso.");
	}


}
