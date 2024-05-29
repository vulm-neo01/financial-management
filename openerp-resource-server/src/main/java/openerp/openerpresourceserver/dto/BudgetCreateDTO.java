package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetCreateDTO {

    private String name;

    private String type;

    private String userId;

    private String description;

    private String logoId;

    private BigDecimal limitAmount;
}
