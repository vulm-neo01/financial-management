package financialsaver.resourceserver.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PayDebtLoanRequest {
    private UUID walletId;
    private String exchangeTypeId;
    private String description;
    private BigDecimal amount;
}
