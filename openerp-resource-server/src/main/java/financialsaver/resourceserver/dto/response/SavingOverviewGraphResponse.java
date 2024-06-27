package financialsaver.resourceserver.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SavingOverviewGraphResponse {
    private BigDecimal totalCurrentAmount;
    private BigDecimal totalIncomeSavingAmount;
    private BigDecimal totalOutcomeSavingAmount;
    private Integer totalSavingAccount;
}
