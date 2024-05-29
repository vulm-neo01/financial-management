package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.ReceiveInterestTime;
import openerp.openerpresourceserver.entity.support.SavingType;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavingDTO {
    private String name;
    private String userId;
    private UUID savingCategoryId;
    private String logoId;
    private String colorId;
    private String description;
    private Date targetDate;
    private BigDecimal originAmount;
    private BigDecimal targetAmount;
    private SavingType savingType;
    private ReceiveInterestTime receiveInterestTime;
//    private BigDecimal expectedAmount;
    private UUID walletId;
    private BigDecimal interestRate;
    private Date startDate;
}
