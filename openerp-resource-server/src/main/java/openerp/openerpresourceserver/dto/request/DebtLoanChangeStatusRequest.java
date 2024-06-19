package openerp.openerpresourceserver.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.ExchangeType;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DebtLoanChangeStatusRequest {
    private UUID walletId;
    private String exchangeTypeId;
    private String description;
}
