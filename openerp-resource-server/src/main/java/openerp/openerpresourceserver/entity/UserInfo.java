package openerp.openerpresourceserver.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.CurrencyCategory;
import openerp.openerpresourceserver.entity.support.SavingCategory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_info")
public class UserInfo {
    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id", updatable = false, nullable = false)
    private String userId;

    @Column(name = "first_name", updatable = false, nullable = false)
    private String firstName;

    @Column(name = "last_name", updatable = false, nullable = false)
    private String lastName;

    private String email;

    private String phone;

    private String address;

//    @Column(name = "currency_id", updatable = false, nullable = false)
//    private String currencyId;
    @ManyToOne
    @JoinColumn(name = "currency_id", referencedColumnName = "currency_category_id")
    private CurrencyCategory currency;

    @CreatedDate
    @Column(name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;

    private String profilePicture;

//    @OneToOne(cascade = CascadeType.ALL)
//    @JsonManagedReference
////    @JsonIgnore
//    @JoinColumn(name = "user_name", referencedColumnName = "user_login_id")
//    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "user", orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BudgetCategory> budgetCategories;

    @OneToMany(mappedBy = "user", orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Wallet> wallets;

    @OneToMany(mappedBy = "user", orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Saving> savings;

    @Column(name = "user_name")
    private String username;
}
