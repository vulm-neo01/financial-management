package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletStatusDTO {
    private Boolean status;
    private String userId;
}
