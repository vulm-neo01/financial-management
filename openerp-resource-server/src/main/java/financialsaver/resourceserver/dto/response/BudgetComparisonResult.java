package financialsaver.resourceserver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetComparisonResult {
    private UUID groupBudgetId;
    private String budgetName;
    private BigDecimal currentAmount;
    private BigDecimal limitAmount;
    private boolean isOverLimit;
}
