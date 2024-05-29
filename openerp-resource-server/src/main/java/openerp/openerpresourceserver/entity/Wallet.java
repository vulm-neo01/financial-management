package openerp.openerpresourceserver.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.support.Color;
import openerp.openerpresourceserver.entity.support.CurrencyCategory;
import openerp.openerpresourceserver.entity.support.Logo;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "wallet")
public class Wallet {
    @Id
    @Column(name = "wallet_id", updatable = false, nullable = false)
    private UUID walletId;

//    @Column(name = "user_id", updatable = false, nullable = false)
//    private String userId;
    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserInfo user;

    @OneToMany(mappedBy = "wallet", orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Exchange> listExchanges;

    private String type;

    private String name;

    private BigDecimal amount;

//    @ManyToOne
////    @JsonIgnore
//    @JoinColumn(name = "currency_id", referencedColumnName = "currency_category_id")
//    private CurrencyCategory currency;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "logo_id", referencedColumnName = "logo_id")
    private Logo logo;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "color_id", referencedColumnName = "color_id")
    private Color color;

    @Column(name = "include_in_total_amount")
    private Boolean includeInTotalAmount;

    private String description;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;
}
