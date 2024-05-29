package openerp.openerpresourceserver.entity.support;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.UserInfo;

import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "saving_category")
public class SavingCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "saving_category_id", updatable = false, nullable = false)
    private UUID savingCategoryId;

    private String name;

    private String type;

    private String description;
}
