package financialsaver.resourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetLimitDTO {
    private UUID categoryId;
    private BigDecimal limitAmount;
    private LocalDate effectiveDate;
}
