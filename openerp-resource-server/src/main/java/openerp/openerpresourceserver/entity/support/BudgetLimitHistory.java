package openerp.openerpresourceserver.entity.support;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@Table(name = "budget_limit_history")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetLimitHistory {
    @Id
    @GeneratedValue
    private UUID budgetLimitId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonBackReference
    @JoinColumn(name = "budget_category_id", referencedColumnName = "budget_category_id")
    private BudgetCategory budgetCategory;

    @Column(name = "limit_amount")
    private BigDecimal limitAmount;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;
}
