package financialsaver.resourceserver.controller.support;

import financialsaver.resourceserver.service.LogoService;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.entity.support.Logo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/logo")
public class LogoController {
    private LogoService logoService;

    @GetMapping("/{type}")
    public ResponseEntity<?> getAllLogoByType(@PathVariable String type){
        List<Logo> logos = logoService.getAllLogosByType(type);
        return ResponseEntity.ok().body(logos);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllLogo(){
        List<Logo> logos = logoService.getAllLogos();
        return ResponseEntity.ok().body(logos);
    }
}
