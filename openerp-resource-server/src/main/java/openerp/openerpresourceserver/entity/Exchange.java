package openerp.openerpresourceserver.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.ExchangeType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "exchange")
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "exchange_id")
    private UUID exchangeId;

    @ManyToOne
    @JsonManagedReference
//    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserInfo user;

    @ManyToOne
    @JsonManagedReference
//    @JsonIgnore
    @JoinColumn(name = "wallet_id", referencedColumnName = "wallet_id")
    private Wallet wallet;

    @Column(name = "destination_id")
    private UUID destinationId;

    @ManyToOne
    @JsonManagedReference
//    @JsonIgnore
    @JoinColumn(name = "exchange_type_id", referencedColumnName = "exchange_type_id")
    private ExchangeType exchangeType;

    @Column(name = "exchange_from")
    private String from;
    @Column(name = "exchange_to")
    private String to;

    @Column(name = "exchange_date")
    private OffsetDateTime exchangeDate;

    private String description;

    private BigDecimal amount;

    @Column(name = "repeat_time_unit")
    private Integer repeatTimeUnit;

    @Column(name = "repeat_number_per_unit")
    private Integer repeatNumberPerUnit;

    @Column(name = "repeat_number")
    private Integer repeatNumber;

    @Column(name = "alarm_date")
    private OffsetDateTime alarmDate;

    @ManyToOne
    @JsonManagedReference
    //    @JsonIgnore
    @JoinColumn(name = "budget_category_id", referencedColumnName = "budget_category_id")
    private BudgetCategory category;

    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
