package financialsaver.resourceserver.dto.response;

import financialsaver.resourceserver.entity.group.GroupBudget;
import financialsaver.resourceserver.entity.support.BudgetCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverviewGroupExchangeBudget {
    private BigDecimal amount;
    private Date exchangeDate;
    private GroupBudget groupBudget;
    private String exchangeType;
}
