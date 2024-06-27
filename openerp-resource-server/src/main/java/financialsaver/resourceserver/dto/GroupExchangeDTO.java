package financialsaver.resourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupExchangeDTO {
    private UUID groupWalletId;
    private String createdUserId;
    private String exchangeTypeId;
    private String name;
    private String from;
    private String to;
    private BigDecimal amount;
    private UUID groupBudgetId;
    private String imageUrl;
    private Date exchangeDate;
    private String description;
}
