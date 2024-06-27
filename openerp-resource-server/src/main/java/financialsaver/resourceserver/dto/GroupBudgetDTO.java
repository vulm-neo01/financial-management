package financialsaver.resourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupBudgetDTO {
    private UUID groupWalletId;
    private String name;
    private String type;
    private String logoId;
    private String description;
    private BigDecimal limitAmount;
    private String createdUserId;
}
