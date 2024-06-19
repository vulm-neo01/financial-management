package openerp.openerpresourceserver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.ExchangeType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverviewExchangeBudgetDTO {
    private BigDecimal amount;
    private LocalDate exchangeDate;
    private BudgetCategory budgetCategory;
    private String exchangeType;
}
