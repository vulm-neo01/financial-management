package financialsaver.resourceserver.service.impl;

import financialsaver.resourceserver.service.LogoService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.entity.support.Logo;
import financialsaver.resourceserver.repo.support.LogoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
@AllArgsConstructor(onConstructor_ = @Autowired)
public class LogoServiceImpl implements LogoService {

    private LogoRepo logoRepo;
    @Override
    public List<Logo> getAllLogosByType(String type) {
        List<Logo> logos = logoRepo.findAllByType(type);
        return logos;
    }

    @Override
    public List<Logo> getListPredefinedLogo() {
        List<Logo> res = new ArrayList<>();
        res.add(logoRepo.findById("food_00").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("food_drink_01").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("shopping_01").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("travel_00").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("family_01").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("entertainment_00").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("house_00").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("income_01").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("income_02").orElseThrow(IllegalArgumentException::new));
        res.add(logoRepo.findById("income_03").orElseThrow(IllegalArgumentException::new));
        return res;
    }

    @Override
    public Logo getLogoById(String id) {
        return logoRepo.findById(id).orElseThrow(IllegalArgumentException::new);
    }

    @Override
    public List<Logo> getAllLogos() {
        return logoRepo.findAll();
    }
}
