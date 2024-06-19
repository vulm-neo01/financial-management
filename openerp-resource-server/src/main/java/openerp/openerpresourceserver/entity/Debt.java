package openerp.openerpresourceserver.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.Color;
import openerp.openerpresourceserver.entity.support.LoanDebtType;
import openerp.openerpresourceserver.entity.support.ReceiveInterestTime;
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
@Table(name = "debt")
public class Debt {
    @Id
    @Column(name = "debt_id", updatable = false, nullable = false)
    private UUID debtId;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserInfo user;

    private String name;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "color_id", referencedColumnName = "color_id")
    private Color color;

    private String description;

    @Column(name = "current_amount")
    private BigDecimal currentAmount;

    @Column(name = "origin_amount")
    private BigDecimal originAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "debt_type")
    private LoanDebtType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "receive_interest_time")
    private ReceiveInterestTime receiveInterestTime;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "expected_interest_amount")
    private BigDecimal expectedInterestAmount;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "change_date")
    private Date changeDate;

    @Column(name = "return_date")
    private Date returnDate;

    @Column(name = "open_status")
    private Boolean openStatus;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;
}
