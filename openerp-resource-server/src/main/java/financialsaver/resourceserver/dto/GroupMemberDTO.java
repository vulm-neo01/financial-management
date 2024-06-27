package financialsaver.resourceserver.dto;

import financialsaver.resourceserver.entity.group.GroupRole;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GroupMemberDTO {
    private String userId;
    private String createdUserId;
    private UUID groupWalletId;
    @Enumerated(EnumType.STRING)
    private GroupRole role;
}
