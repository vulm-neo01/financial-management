package financialsaver.resourceserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@SpringBootApplication
public class FinancialSaverResourceServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinancialSaverResourceServerApplication.class, args);
    }

}
