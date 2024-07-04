package financialsaver.resourceserver.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetGroupGraphRequest {
    private LocalDate exchangeDate;
    private UUID groupWalletId;
}
