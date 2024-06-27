package financialsaver.resourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletDTO {
    private String userId;
    private String type;
    private String name;
    private String amount;
    private String logoId;
    private String colorId;
    private Boolean includeInTotalAmount;
    private String description;
}
