package com.medmuse.medmuse_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"medmuse.ai.provider=openai",
		"medmuse.ai.openai.api-key=test-key"
})
class MedMuseBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
