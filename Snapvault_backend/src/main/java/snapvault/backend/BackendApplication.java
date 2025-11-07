package snapvault.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	
	// @Bean
	// public CommandLineRunner run(SnapshotService snapshotService) {
	// 	return args -> {
	// 		System.out.println("--- EXECUTING TEST SNAPSHOT ---");
	// 		// 1. Create your 'test_v1' folder and files first
	// 		snapshotService.createSnapshot("test_v1", "My First Snapshot");
	// 		System.out.println("--- SNAPSHOT 1 CREATED ---");

	// 		// 2. Now, modify 'test_v1' (add/change a file)
	// 		// (You might need to add a "Press Enter to continue" to do this manually)
	// 		// ... or just snapshot a *different* folder
	// 		snapshotService.createSnapshot("test_v2", "My Second Snapshot");
	// 		System.out.println("--- SNAPSHOT 2 CREATED ---");

	// 		System.out.println("--- CHECK YOUR 'snapvault_db' AND 'snapvault_data' FOLDER ---");
	// 	};
	// }

}
