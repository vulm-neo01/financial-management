package openerp.openerpresourceserver.dto;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.UserInfo;
import openerp.openerpresourceserver.entity.support.Color;
import openerp.openerpresourceserver.entity.support.LoanDebtType;
import openerp.openerpresourceserver.entity.support.ReceiveInterestTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLoanDTO {
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
