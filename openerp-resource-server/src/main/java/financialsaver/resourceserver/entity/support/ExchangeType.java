package financialsaver.resourceserver.entity.support;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "exchange_type")
public class ExchangeType {
    @Id
    @Column(name = "exchange_type_id", updatable = false, nullable = false)
    private String exchangeTypeId;

    @Column(name = "exchange_type_name")
    private String exchangeTypeName;

    private String description;

    @Column(name = "destination_type")
    private String destinationType;
}
