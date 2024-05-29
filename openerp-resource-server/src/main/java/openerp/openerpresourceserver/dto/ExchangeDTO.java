package openerp.openerpresourceserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeDTO {
    private String userId;
    private UUID walletId;
    private UUID destinationId;
    private String exchangeTypeId;
    private String from;
    private String to;
    private OffsetDateTime exchangeDate;
    private String description;
    private BigDecimal amount;
    private Integer repeatTimeUnit;
    private Integer repeatNumberPerUnit;
    private Integer repeatNumber;
    private OffsetDateTime alarmDate;
    private String category;
    private String imageUrl;
}
