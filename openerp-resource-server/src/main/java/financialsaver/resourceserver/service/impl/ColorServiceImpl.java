package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.service.ColorService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.entity.support.Color;
import financialsaver.resourceserver.repo.support.ColorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor(onConstructor_ = @Autowired)
@Log4j2
public class ColorServiceImpl implements ColorService {
    private ColorRepo colorRepo;
    @Override
    public List<Color> getAllColorByType(String type) {
        return colorRepo.findAllByType(type);
    }

    @Override
    public Color getById(String id) {
        Color color = colorRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("ColorId is not exist!"));
        return color;
    }
}
