package financialsaver.resourceserver.service;

import financialsaver.resourceserver.entity.support.Logo;

import java.util.List;

public interface LogoService {

    List<Logo> getAllLogosByType(String type);

    List<Logo> getListPredefinedLogo();

    Logo getLogoById(String id);

    List<Logo> getAllLogos();
}
