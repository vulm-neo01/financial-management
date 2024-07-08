package financialsaver.resourceserver.service;

import financialsaver.resourceserver.entity.Saving;
import financialsaver.resourceserver.dto.ExchangeDTO;
import financialsaver.resourceserver.dto.SavingDTO;
import financialsaver.resourceserver.entity.support.SavingCategory;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface SavingService {
    List<Saving> getAllSaving();

    Saving getBySavingId(UUID savingId);

    List<Saving> getAllByUserId(String userId);

    List<Saving> createSaving(SavingDTO savingDTO);

    Saving updateSaving(SavingDTO savingDTO, UUID savingId) throws IllegalAccessException;

    void updateSavingFromExchange(ExchangeDTO exchangeDTO);

    List<SavingCategory> getAllSavingCategory();

    List<Saving> removeSaving(UUID savingId);

    void updateSavingAfterUpdateExchange(UUID saving, BigDecimal amount, OffsetDateTime exchangeDate);

    void doneSaving(Saving saving);

    BigDecimal getSavingTotalAmount(String userId);
}
