package financialsaver.resourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupWalletDTO {
    private String ownerId;
    private String groupName;
    private BigDecimal amount;
    private String logoId;
    private String description;
}
