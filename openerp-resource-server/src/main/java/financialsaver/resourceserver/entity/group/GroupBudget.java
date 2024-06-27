package financialsaver.resourceserver.entity.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import financialsaver.resourceserver.entity.UserInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import financialsaver.resourceserver.entity.support.Logo;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "group_budget")
public class GroupBudget {
    @Id
    @Column(name = "group_budget_id")
    private UUID groupBudgetId;

    @ManyToOne
    @JsonManagedReference
//    @JsonIgnore
    @JoinColumn(name = "group_wallet_id", referencedColumnName = "group_wallet_id")
    private GroupWallet groupWallet;

    private String name;

    private String type;

    @ManyToOne
    @JsonManagedReference
    @JsonIgnore
    @JoinColumn(name = "created_user_id", referencedColumnName = "user_id")
    private UserInfo createdUser;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "logo_id", referencedColumnName = "logo_id")
    private Logo logo;

    private String description;

    @Column(name = "limit_amount")
    private BigDecimal limitAmount;

    @Column(name = "is_active")
    private Boolean isActive;
}
