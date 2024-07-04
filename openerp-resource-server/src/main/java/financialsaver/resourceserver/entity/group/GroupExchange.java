package financialsaver.resourceserver.entity.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import financialsaver.resourceserver.entity.UserInfo;
import financialsaver.resourceserver.entity.support.ExchangeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "group_exchange")
public class GroupExchange {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "group_exchange_id")
    private UUID groupExchangeId;

    @ManyToOne
    @JsonManagedReference
//    @JsonIgnore
    @JoinColumn(name = "created_user_id", referencedColumnName = "user_id")
    private UserInfo createdUser;

    private String updatedUserId;

    @ManyToOne
    @JsonManagedReference
    @JsonIgnore
    @JoinColumn(name = "group_wallet_id", referencedColumnName = "group_wallet_id")
    private GroupWallet groupWallet;

    @ManyToOne
    @JsonManagedReference
//    @JsonIgnore
    @JoinColumn(name = "exchange_type_id", referencedColumnName = "exchange_type_id")
    private ExchangeType exchangeType;

    private String name;

    @Column(name = "exchange_from")
    private String from;

    @Column(name = "exchange_to")
    private String to;

    @Column(name = "exchange_date")
    private Date exchangeDate;

    private String description;

    private BigDecimal amount;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "budget_id", referencedColumnName = "group_budget_id")
    private GroupBudget budget;

    @Column(name = "image_url")
    private String imageUrl;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;
}
