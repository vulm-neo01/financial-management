package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.dto.ExchangeDTO;
import openerp.openerpresourceserver.dto.SavingDTO;
import openerp.openerpresourceserver.dto.SavingHistoryDTO;
import openerp.openerpresourceserver.entity.Saving;
import openerp.openerpresourceserver.entity.support.SavingCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface SavingService {
    List<Saving> getAllSaving();

    Saving getBySavingId(UUID savingId);

    List<Saving> getAllByUserId(String userId);

    List<Saving> createSaving(SavingDTO savingDTO);

    Saving updateSaving(SavingDTO savingDTO, UUID savingId);

    void updateSavingFromExchange(ExchangeDTO exchangeDTO);

    List<SavingCategory> getAllSavingCategory();

    List<Saving> removeSaving(UUID savingId);

    void updateSavingAfterUpdateExchange(UUID saving, BigDecimal amount, OffsetDateTime exchangeDate);
}
