package openerp.openerpresourceserver.entity.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverviewWalletDTO {
    private BigDecimal totalAmount;
    private LocalDate changeDate;
}
