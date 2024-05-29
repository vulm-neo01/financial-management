package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.support.Logo;

import java.util.List;

public interface LogoService {

    List<Logo> getAllLogos(String type);

    List<Logo> getListPredefinedLogo();

    Logo getLogoById(String id);
}
