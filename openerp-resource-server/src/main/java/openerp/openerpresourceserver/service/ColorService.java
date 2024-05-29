package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.support.Color;

import java.util.List;

public interface ColorService {
    List<Color> getAllColorByType(String type);

    Color getById(String id);
}
