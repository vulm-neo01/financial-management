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
public class LoanDebtOverviewGraphResponse {
    private BigDecimal totalLoanCurrentAmount;
    private BigDecimal totalDebtCurrentAmount;
    private BigDecimal totalLoanGetAmount;
    private BigDecimal totalLoanPayAmount;
    private BigDecimal totalDebtPayAmount;
    private BigDecimal totalDebtGetAmount;
    private Integer totalDebtAccount;
    private Integer totalLoanAccount;
}
