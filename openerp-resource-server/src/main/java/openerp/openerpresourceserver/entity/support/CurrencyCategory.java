package openerp.openerpresourceserver.entity.support;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "currency_category")
public class CurrencyCategory {
    @Id
    @Column(name = "currency_category_id", nullable = false, updatable = false)
    private String currencyCategoryId;

    private String name;

    private String code;

    private String symbol;

    @Column(name = "exchange_rate")
    private BigDecimal exchangeRate;

    @Column(name = "is_active")
    private Boolean isActive;

    private String description;
}
