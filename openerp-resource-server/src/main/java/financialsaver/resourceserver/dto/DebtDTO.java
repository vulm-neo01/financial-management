package financialsaver.resourceserver.dto;

import financialsaver.resourceserver.entity.support.LoanDebtType;
import financialsaver.resourceserver.entity.support.ReceiveInterestTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtDTO {
    private String userId;
    private Boolean isCreateExchange;
    private UUID walletId;
    private String name;
    private String colorId;
    private String description;
    private BigDecimal originAmount;
    private LoanDebtType type;
    private ReceiveInterestTime receiveInterestTime;
    private BigDecimal interestRate;
    private Date startDate;
    private Date returnDate;
}
