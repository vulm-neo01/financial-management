package openerp.openerpresourceserver;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import java.util.TimeZone;

@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@SpringBootApplication
public class OpenerpResourceServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(OpenerpResourceServerApplication.class, args);
    }

}
