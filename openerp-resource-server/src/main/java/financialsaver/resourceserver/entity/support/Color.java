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
@Table(name = "color")
public class Color {
    @Id
    @Column(name = "color_id", nullable = false, updatable = false)
    private String colorId;

    private String name;

    @Column(name = "hex_code")
    private String hexCode;

//    Color cho entity nào. Dạng nếu cho Wallet, Exchange, thì khác nhau
    private String type;

    private String description;

}
