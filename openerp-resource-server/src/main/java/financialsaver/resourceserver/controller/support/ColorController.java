package financialsaver.resourceserver.controller.support;

import financialsaver.resourceserver.service.ColorService;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.entity.support.Color;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/color")
public class ColorController {

    private ColorService colorService;

    @GetMapping("/{type}")
    public ResponseEntity<?> getAllColorByType(@PathVariable String type){
        List<Color> logos = colorService.getAllColorByType(type);
        return ResponseEntity.ok().body(logos);
    }
}
