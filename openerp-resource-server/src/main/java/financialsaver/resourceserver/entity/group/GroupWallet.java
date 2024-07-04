package financialsaver.resourceserver.entity.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import financialsaver.resourceserver.entity.UserInfo;
import financialsaver.resourceserver.entity.support.Logo;
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
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "group_wallet")
public class GroupWallet {
    @Id
    @Column(name = "group_wallet_id", updatable = false, nullable = false)
    private UUID groupWalletId;

    @ManyToOne
//    @JsonIgnore
    @JsonManagedReference
    @JoinColumn(name = "owner_id", referencedColumnName = "user_id")
    private UserInfo owner;

    @Column(name = "group_name")
    private String groupName;

    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "logo_id", referencedColumnName = "logo_id")
    private Logo logo;

    private String description;

    @Column(name = "is_active")
    private Boolean isActive;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;
}
