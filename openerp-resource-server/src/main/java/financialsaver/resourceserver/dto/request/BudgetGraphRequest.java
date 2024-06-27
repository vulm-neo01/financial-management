package financialsaver.resourceserver.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetGraphRequest {
    private LocalDate exchangeDate;
    private String userId;
}
