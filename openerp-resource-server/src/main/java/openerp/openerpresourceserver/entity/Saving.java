package openerp.openerpresourceserver.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "saving")
public class Saving {
    @Id
    @Column(name = "saving_id", updatable = false, nullable = false)
    private UUID savingId;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "saving_category_id", referencedColumnName = "saving_category_id")
    private SavingCategory savingCategory;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserInfo user;

    private String name;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "logo_id", referencedColumnName = "logo_id")
    private Logo logo;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "color_id", referencedColumnName = "color_id")
    private Color color;

    private String description;

    @Column(name = "target_amount")
    private BigDecimal targetAmount;

    @Column(name = "current_amount")
    private BigDecimal currentAmount;

    @Column(name = "origin_amount")
    private BigDecimal originAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "saving_type")
    private SavingType savingType;

    @Enumerated(EnumType.STRING)
    @Column(name = "receive_interest_time")
    private ReceiveInterestTime receiveInterestTime;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "expected_interest")
    private BigDecimal expectedInterest;

    @Column(name = "wallet_id")
    private UUID walletId;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "change_date")
    private Date changeDate;

    @Column(name = "target_date")
    private Date targetDate;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;
}
