package financialsaver.resourceserver.entity.group;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import financialsaver.resourceserver.entity.UserInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "group_member")
public class GroupMember {

    @Id
    @Column(name = "group_member_id")
    private UUID groupMemberId;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "group_wallet_id", referencedColumnName = "group_wallet_id")
    private GroupWallet wallet;

    @ManyToOne
    @JsonManagedReference
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private UserInfo user;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private GroupRole role;

    @Column(name = "joined_at")
    @CreatedDate
    private Date joinedAt;

    @Column(name = "action_status")
    private Boolean actionStatus;
}
