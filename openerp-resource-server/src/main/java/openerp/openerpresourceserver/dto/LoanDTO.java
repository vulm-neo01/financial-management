package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.LoanDebtType;
import openerp.openerpresourceserver.entity.support.ReceiveInterestTime;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanDTO {
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
