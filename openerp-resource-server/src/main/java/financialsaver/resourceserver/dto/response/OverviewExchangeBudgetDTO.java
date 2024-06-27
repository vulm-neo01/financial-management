package financialsaver.resourceserver.dto.response;

import financialsaver.resourceserver.entity.support.BudgetCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
