package openerp.openerpresourceserver.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.UserInfo;
import openerp.openerpresourceserver.entity.support.Color;
import openerp.openerpresourceserver.entity.support.CurrencyCategory;
import openerp.openerpresourceserver.entity.support.Logo;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletDTO {
    private String userId;
    private String type;
    private String name;
    private String amount;
    private String logoId;
    private String colorId;
    private Boolean includeInTotalAmount;
    private String description;
}
