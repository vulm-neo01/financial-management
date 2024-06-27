package financialsaver.resourceserver.entity.support;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "logo")
public class Logo {
    @Id
    @Column(name = "logo_id", nullable = false, updatable = false)
    private String logoId;

    private String name;

    private String url;

    private String type;

    private String description;
}