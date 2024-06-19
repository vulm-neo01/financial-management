package openerp.openerpresourceserver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetGraphResponse {
    private String name;
    private BigDecimal spentAmount;
    private BigDecimal remainAmount;
    private BigDecimal limitAmount;
    private String type;
    private LocalDate date;
}
