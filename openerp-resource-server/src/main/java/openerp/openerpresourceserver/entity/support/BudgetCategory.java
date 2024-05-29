package openerp.openerpresourceserver.entity.support;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.UserInfo;

import java.util.List;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "budget_category")
public class BudgetCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "budget_category_id", updatable = false, nullable = false)
    private UUID budgetCategoryId;

    private String name;

    private String type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserInfo user;

    private String description;

    @ManyToOne
//    @JsonIgnore
    @JoinColumn(name = "logo_id", referencedColumnName = "logo_id")
    private Logo logo;

    @OneToMany(mappedBy = "budgetCategory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<BudgetLimitHistory> budgetLimitHistories;
}
