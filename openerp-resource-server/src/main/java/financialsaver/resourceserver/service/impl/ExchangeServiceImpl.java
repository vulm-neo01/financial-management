package financialsaver.resourceserver.service.impl;

import com.cloudinary.Cloudinary;
import financialsaver.resourceserver.dto.ExchangeDTO;
import financialsaver.resourceserver.dto.SavingHistoryDTO;
import financialsaver.resourceserver.dto.request.BudgetGraphRequest;
import financialsaver.resourceserver.dto.response.BudgetGraphResponse;
import financialsaver.resourceserver.dto.response.OverviewExchangeBudgetDTO;
import financialsaver.resourceserver.dto.response.OverviewWalletDTO;
import financialsaver.resourceserver.dto.response.SavingOverviewGraphResponse;
import financialsaver.resourceserver.entity.Exchange;
import financialsaver.resourceserver.entity.Saving;
import financialsaver.resourceserver.entity.Wallet;
import financialsaver.resourceserver.entity.support.BudgetCategory;
import financialsaver.resourceserver.entity.support.ExchangeType;
import financialsaver.resourceserver.entity.support.SavingType;
import financialsaver.resourceserver.repo.ExchangeRepo;
import financialsaver.resourceserver.repo.support.ExchangeTypeRepo;
import financialsaver.resourceserver.service.*;
import financialsaver.resourceserver.utils.time.CalculateTimes;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import financialsaver.resourceserver.entity.support.BudgetLimitHistory;
import financialsaver.resourceserver.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor_ = @Autowired)
@Log4j2
public class ExchangeServiceImpl implements ExchangeService {

    private ExchangeRepo exchangeRepo;
    private ExchangeTypeRepo exchangeTypeRepo;
    private WalletService walletService;
    private UserInfoService userService;
    private BudgetService budgetService;
    private Cloudinary cloudinary;
    private SavingService savingService;
    private LoanAndDebtService loanAndDebtService;

    @Override
    public List<Exchange> getAllExchanges() {
        return exchangeRepo.findAll();
    }

    @Override
    public List<Exchange> getAllExchangesByUserId(String userId) {
        List<Exchange> exchanges = exchangeRepo.findAllByUser_UserId(userId);
        return exchanges;
    }

    @Override
    public List<Exchange> createWalletToWalletExchange(ExchangeDTO exchangeDTO) {
        Wallet sendingWallet = walletService.getWalletById(exchangeDTO.getWalletId());
        Wallet receiveWallet = walletService.getWalletById(exchangeDTO.getDestinationId());

//        Check Amount of Wallet ? Is it really necessary
//        if(sendingWallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0){
//            throw new IllegalArgumentException("Wallet is not enough money");
//        }
        if(sendingWallet.getType().equals("credit")){
            throw new IllegalArgumentException("Can not send money from Credit Card, Credit only receive money!");
        }

        if(exchangeDTO.getExchangeTypeId() != null){
            Optional<ExchangeType> exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId());
            if(exchangeType1.isEmpty()){
                throw new IllegalArgumentException("Exchange Type is invalid!");
            }
        }
        if(sendingWallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0){
            throw new RuntimeException("SendWallet: " + sendingWallet.getName() + " not enough money!");
        }
//        Optional<BudgetCategory> budgetCategory = budgetService.getBudgetById(exchangeDTO.getCategory());
//        if(budgetCategory.isEmpty()){
//            throw new IllegalArgumentException("Budget Category Id is invalid!");
//        }
        sendingWallet.setAmount(sendingWallet.getAmount().subtract(exchangeDTO.getAmount()));
        sendingWallet.setUpdatedAt(new Date());
        receiveWallet.setAmount(receiveWallet.getAmount().add(exchangeDTO.getAmount()));
        receiveWallet.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(sendingWallet);
        walletService.updateWalletFromExchange(receiveWallet);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).get())
                .from(sendingWallet.getName())
                .to(receiveWallet.getName())
                .exchangeDate(exchangeDTO.getExchangeDate())
                .description(exchangeDTO.getDescription())
                .amount(exchangeDTO.getAmount())
                .repeatTimeUnit(exchangeDTO.getRepeatTimeUnit())
                .repeatNumberPerUnit(exchangeDTO.getRepeatNumberPerUnit())
                .repeatNumber(exchangeDTO.getRepeatNumber())
                .category(null)
                .imageUrl(exchangeDTO.getImageUrl())
                .alarmDate(exchangeDTO.getAlarmDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        exchangeRepo.save(newExchange);
        return getAllExchangesByUserId(exchangeDTO.getUserId());
    }

    @Override
    public List<Exchange> createIncomeExchange(ExchangeDTO exchangeDTO) {
        Wallet wallet = walletService.getWalletById(exchangeDTO.getWalletId());

        if(exchangeDTO.getExchangeTypeId() != null){
            Optional<ExchangeType> exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId());
            if(exchangeType1.isEmpty()){
                throw new IllegalArgumentException("Exchange Type is invalid!");
            }
        }
        Optional<BudgetCategory> budgetCategory = budgetService.getBudgetById(exchangeDTO.getCategory());
        if(budgetCategory.isEmpty()){
            throw new IllegalArgumentException("Budget Category Id is invalid!");
        }

        wallet.setAmount(wallet.getAmount().add(exchangeDTO.getAmount()));
        wallet.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(wallet);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).get())
                .from(exchangeDTO.getFrom())
                .to(wallet.getName())
                .exchangeDate(exchangeDTO.getExchangeDate())
                .description(exchangeDTO.getDescription())
                .amount(exchangeDTO.getAmount())
                .repeatTimeUnit(exchangeDTO.getRepeatTimeUnit())
                .repeatNumberPerUnit(exchangeDTO.getRepeatNumberPerUnit())
                .repeatNumber(exchangeDTO.getRepeatNumber())
                .category(budgetCategory.get())
                .imageUrl(exchangeDTO.getImageUrl())
                .alarmDate(exchangeDTO.getAlarmDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        Exchange exchange = exchangeRepo.save(newExchange);
        return getAllExchangesByUserId(exchangeDTO.getUserId());
    }

    @Override
    public List<Exchange> createSpendExchange(ExchangeDTO exchangeDTO) {
        Wallet wallet = walletService.getWalletById(exchangeDTO.getWalletId());

        if(exchangeDTO.getExchangeTypeId() != null){
            Optional<ExchangeType> exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId());
            if(exchangeType1.isEmpty()){
                throw new IllegalArgumentException("Exchange Type is invalid!");
            }
        }
        Optional<BudgetCategory> budgetCategory = budgetService.getBudgetById(exchangeDTO.getCategory());
        if(budgetCategory.isEmpty()){
            throw new IllegalArgumentException("Budget Category Id is invalid!");
        }

        if(wallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0 && !wallet.getType().equals("credit")){
            throw new RuntimeException("SendingWallet: " + wallet.getName() + " not enough money!");
        }

        wallet.setAmount(wallet.getAmount().subtract(exchangeDTO.getAmount()));
        wallet.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(wallet);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).get())
                .from(wallet.getName())
                .to(exchangeDTO.getTo())
                .exchangeDate(exchangeDTO.getExchangeDate())
                .description(exchangeDTO.getDescription())
                .amount(exchangeDTO.getAmount())
                .repeatTimeUnit(exchangeDTO.getRepeatTimeUnit())
                .repeatNumberPerUnit(exchangeDTO.getRepeatNumberPerUnit())
                .repeatNumber(exchangeDTO.getRepeatNumber())
                .category(budgetCategory.get())
                .imageUrl(exchangeDTO.getImageUrl())
                .alarmDate(exchangeDTO.getAlarmDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        Exchange exchange = exchangeRepo.save(newExchange);
        return getAllExchangesByUserId(exchangeDTO.getUserId());
    }

    @Override
    public Exchange getExchangeById(UUID exchangeId) {
        return exchangeRepo.findById(exchangeId)
                .orElseThrow(() -> new NoSuchElementException("Not exist exchange with id " + exchangeId));
    }

    @Override
    public List<Exchange> deleteExchange(String userId, UUID exchangeId) {
        Exchange exchange = getExchangeById(exchangeId);
        if (exchange != null && userId != null && userId.equals(exchange.getUser().getUserId())) {
            String exchangeType = exchange.getExchangeType().getExchangeTypeId();
            UUID walletId = exchange.getWallet().getWalletId();
            BigDecimal amount = exchange.getAmount();
            UUID wallet;
            UUID saving;
            UUID loan;
            UUID debt;
            switch (exchangeType.toLowerCase()) { // Use lowercase for case-insensitive matching
                case "wallet_wallet":
                    wallet = exchange.getDestinationId();
                    walletService.updateWalletAfterUpdateExchange(walletId, amount);
                    walletService.updateWalletAfterUpdateExchange(wallet, amount.negate());
                    break;
                case "income", "debt_wallet", "loan_wallet":
                    walletService.updateWalletAfterUpdateExchange(walletId, amount.negate());
                    break;
                case "spend", "wallet_debt", "wallet_loan":
                    walletService.updateWalletAfterUpdateExchange(walletId, amount);
                    break;
//                    try {
//                        loanAndDebtService.removeLoanAccount(exchange.getDestinationId());
//                    } catch (NoSuchElementException e) {
//                        log.info("Loan already removed, continue");
//                    }
                //                    try {
//                        loanAndDebtService.removeLoanAccount(exchange.getDestinationId());
//                    } catch (NoSuchElementException e) {
//                        log.info("Loan already removed, continue");
//                    }
                //                    try {
//                        loanAndDebtService.removeDebtAccount(exchange.getDestinationId());
//                    } catch (NoSuchElementException e) {
//                        log.info("Debt already removed, continue");
//                    }
                //                    try {
//                        loanAndDebtService.removeDebtAccount(exchange.getDestinationId());
//                    } catch (NoSuchElementException e) {
//                        log.info("Debt already removed, continue");
//                    }
                case "saving_wallet":
                    saving = exchange.getDestinationId();
                    walletService.updateWalletAfterUpdateExchange(walletId, amount.negate());
                    savingService.updateSavingAfterUpdateExchange(saving, amount, exchange.getExchangeDate());
                    break;
                case "wallet_saving":
                    saving = exchange.getDestinationId();
                    walletService.updateWalletAfterUpdateExchange(walletId, amount);
                    savingService.updateSavingAfterUpdateExchange(saving, amount.negate(), exchange.getExchangeDate());
                    break;
                default:
                    // Handle invalid exchangeType (throw exception, return error response, etc.)
                    throw new IllegalArgumentException("Invalid exchange type: " + exchangeType);
            }
            exchangeRepo.delete(exchange);
            return getAllExchangesByUserId(userId);
        } else {
            // Throw an exception or return null to indicate that the user ID from the request is invalid
            log.error("Wrong User Id");
            throw new IllegalArgumentException("Invalid user ID or exchange not found");
        }
    }

    @Override
    public List<Exchange> updateExchange(ExchangeDTO exchangeDTO, UUID exchangeId) {
        Exchange exchange = getExchangeById(exchangeId);
        String userId = exchangeDTO.getUserId();
        log.info("start");
        if (exchange != null && userId != null && userId.equals(exchange.getUser().getUserId())) {
            String exchangeType = exchange.getExchangeType().getExchangeTypeId();
            UUID oldWalletId = exchange.getWallet().getWalletId();
            UUID oldDestinationId = exchange.getDestinationId();
            BigDecimal oldAmount = exchange.getAmount();
            UUID saving;
            UUID loan;
            UUID debt;

            if (exchangeDTO.getWalletId() != null) {
                exchange.setWallet(walletService.getWalletById(exchangeDTO.getWalletId()));
            }
            if (exchangeDTO.getAmount() != null) {
                exchange.setAmount(exchangeDTO.getAmount());
            }
            if (exchangeDTO.getExchangeDate() != null) {
                exchange.setExchangeDate(exchangeDTO.getExchangeDate());
            }
            if (exchangeDTO.getDescription() != null) {
                exchange.setDescription(exchangeDTO.getDescription());
            }
            if (exchangeDTO.getCategory() != null && !exchangeDTO.getCategory().isEmpty()) {

                Optional<BudgetCategory> budgetCategory = budgetService.getBudgetById(exchangeDTO.getCategory());
                if(budgetCategory.isPresent()){
                    exchange.setCategory(budgetCategory.get());
                }
            }
            if (exchangeDTO.getFrom() != null) {
                exchange.setFrom(exchangeDTO.getFrom());
            }
            if (exchangeDTO.getTo() != null) {
                exchange.setTo(exchangeDTO.getTo());
            }
            if (exchangeDTO.getDestinationId() != null) {
                exchange.setDestinationId(exchangeDTO.getDestinationId());
            }
            if( exchangeDTO.getImageUrl() != null){
                exchange.setImageUrl(exchangeDTO.getImageUrl());
            }
            BigDecimal newAmount = exchangeDTO.getAmount();
            UUID newWalletId = exchangeDTO.getWalletId();
            log.info(newWalletId);
//            Wallet wallet = walletService.getWalletById(newWalletId);
//            if(wallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0 && !wallet.getType().equals("credit")){
//                throw new RuntimeException("SendingWallet: " + wallet.getName() + " not enough money!");
//            }
            UUID newDestinationId = exchangeDTO.getDestinationId();
            log.info(newDestinationId);
            switch (exchangeType.toLowerCase()) { // Use lowercase for case-insensitive matching
                case "wallet_wallet":
                    exchange.setFrom(walletService.getWalletById(newWalletId).getName());
                    exchange.setTo(walletService.getWalletById(newDestinationId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount);
                    walletService.updateWalletAfterUpdateExchange(oldDestinationId, oldAmount.negate());
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount.negate());
                    walletService.updateWalletAfterUpdateExchange(newDestinationId, newAmount);
                    break;
                case "income":
                    exchange.setTo(walletService.getWalletById(newWalletId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount.negate());
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount);
                    break;
                case "spend":
                    exchange.setFrom(walletService.getWalletById(newWalletId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount);
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount.negate());
                    break;
                case "loan_wallet":
                    if (!newDestinationId.equals(oldDestinationId)){
                        throw new IllegalArgumentException("Can not change loan account!");
                    }
                    exchange.setTo(walletService.getWalletById(newWalletId).getName());
                    exchange.setFrom(loanAndDebtService.getLoanById(newDestinationId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount.negate());
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount);
                    loanAndDebtService.updateLoanAfterUpdateExchange(newDestinationId, newAmount);
                    break;
                case "wallet_loan":
                    if (!newDestinationId.equals(oldDestinationId)){
                        throw new IllegalArgumentException("Can not change loan account!");
                    }
                    exchange.setTo(loanAndDebtService.getLoanById(newDestinationId).getName());
                    exchange.setFrom(walletService.getWalletById(newWalletId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount);
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount.negate());
                    loanAndDebtService.updateLoanAfterUpdateExchange(newDestinationId, newAmount);
                    break;
                case "debt_wallet":
                    if (!newDestinationId.equals(oldDestinationId)){
                        throw new IllegalArgumentException("Can not change debt account!");
                    }
                    exchange.setTo(walletService.getWalletById(newWalletId).getName());
                    exchange.setFrom(loanAndDebtService.getDebtById(newDestinationId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount.negate());
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount);
                    loanAndDebtService.updateDebtAfterUpdateExchange(newDestinationId, newAmount);
                    break;
                case "wallet_debt":
                    if (!newDestinationId.equals(oldDestinationId)){
                        throw new IllegalArgumentException("Can not change debt account!");
                    }
                    exchange.setTo(loanAndDebtService.getDebtById(newDestinationId).getName());
                    exchange.setFrom(walletService.getWalletById(newWalletId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount);
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount.negate());
                    loanAndDebtService.updateDebtAfterUpdateExchange(newDestinationId, newAmount);
                    break;
                case "saving_wallet":
                    log.info("Run here!");
                    exchange.setTo(walletService.getWalletById(newWalletId).getName());
                    exchange.setFrom(savingService.getBySavingId(newDestinationId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount.negate());
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount);
                    savingService.updateSavingAfterUpdateExchange(oldDestinationId, oldAmount, exchange.getExchangeDate());
                    savingService.updateSavingFromExchange(exchangeDTO);
                    break;
                case "wallet_saving":
                    exchange.setFrom(walletService.getWalletById(newWalletId).getName());
                    exchange.setTo(savingService.getBySavingId(newDestinationId).getName());
                    walletService.updateWalletAfterUpdateExchange(oldWalletId, oldAmount);
                    walletService.updateWalletAfterUpdateExchange(newWalletId, newAmount.negate());
                    savingService.updateSavingAfterUpdateExchange(oldDestinationId, oldAmount.negate(), exchange.getExchangeDate());
                    savingService.updateSavingFromExchange(exchangeDTO);
                    break;
                default:
                    // Handle invalid exchangeType (throw exception, return error response, etc.)
                    throw new IllegalArgumentException("Invalid exchange type: " + exchangeType);
            }
            exchangeRepo.save(exchange);
            return getAllExchangesByUserId(userId);
        } else {
            // Throw an exception or return null to indicate that the user ID from the request is invalid
            log.error("Wrong User Id");
            throw new IllegalArgumentException("Invalid user ID or exchange not found");
        }
    }

    public String uploadImage(MultipartFile image) throws IOException {
        Map<String, Object> uploadParams = new HashMap<>();
        uploadParams.put("max_bytes", 2097152);

        // Upload the image to Cloudinary
        Map result = cloudinary.uploader().upload(image.getBytes(), uploadParams);

        // Extract the image URL from the upload result
        String imageUrl = (String) result.get("secure_url");

        return imageUrl;
    }

    @Override
    public List<Exchange> getAllExchangeByWallet(UUID id) {
//        UUID walletId = UUID.fromString(id);
        List<Exchange> exchanges = exchangeRepo.findAllByWallet_WalletId(id);
        List<Exchange> exchangesFromDes = exchangeRepo.findAllByDestinationId(id);

        List<Exchange> listExchanges = new ArrayList<>();
        listExchanges.addAll(exchanges);
        listExchanges.addAll(exchangesFromDes);
        return listExchanges;
    }

    @Override
    public List<Exchange> getExchangesByBudget(UUID budgetId) {
        List<Exchange> allExchanges = exchangeRepo.findAllByCategory_BudgetCategoryId(budgetId);

        return allExchanges.stream()
                .filter(exchange -> {
                    UUID budgetTypeId = exchange.getCategory().getBudgetCategoryId();
                    return budgetId.equals(budgetTypeId);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Exchange> getExchangesByBudgetInOneMonth(String userId) {
        List<Exchange> allExchanges = getAllExchangesByUserId(userId);

        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();


        return allExchanges.stream()
                .filter(exchange -> {
                    LocalDate exchangeDate = exchange.getExchangeDate().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return exchangeDate.getMonthValue() == currentMonth &&
                            exchangeDate.getYear() == currentYear;
                })
                .filter(exchange -> {
                    String exchangeTypeId = exchange.getExchangeType().getExchangeTypeId();
                    return "income".equals(exchangeTypeId) || "spend".equals(exchangeTypeId);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<BudgetGraphResponse> getBudgetExchangesDataGraph(BudgetGraphRequest request) {
        ZonedDateTime zonedDateTime = request.getExchangeDate().atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDate date = zonedDateTime.toLocalDate();
        List<BudgetCategory> budgetCategories = budgetService.getAllBudgetsByUserId(request.getUserId());
        List<BudgetGraphResponse> res = new ArrayList<>();

        List<Exchange> exchanges = getAllExchangesByUserId(request.getUserId()).stream()
                .filter(exchange -> {
                    LocalDate exchangeDate = exchange.getExchangeDate().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate();
                    return exchangeDate.getMonthValue() == date.getMonth().getValue() &&
                            exchangeDate.getYear() == date.getYear();
                })
                .filter(exchange -> {
                    String exchangeTypeId = exchange.getExchangeType().getExchangeTypeId();
                    return "income".equals(exchangeTypeId) || "spend".equals(exchangeTypeId);
                })
                .collect(Collectors.toList());

        for(BudgetCategory budgetCategory : budgetCategories){
            BudgetGraphResponse budgetGraphResponse = new BudgetGraphResponse();
            budgetGraphResponse.setName(budgetCategory.getName());
            budgetGraphResponse.setType(budgetCategory.getType());
            budgetGraphResponse.setDate(date);
            BigDecimal total = BigDecimal.ZERO;
            for(Exchange exchange : exchanges){
                if(exchange.getCategory().getBudgetCategoryId().equals(budgetCategory.getBudgetCategoryId())){
                    total = total.add(exchange.getAmount());
                }
            }
            budgetGraphResponse.setSpentAmount(total);
            List<BudgetLimitHistory> budgetLimitHistories = budgetCategory.getBudgetLimitHistories();
            budgetLimitHistories.sort(Comparator.comparing(BudgetLimitHistory::getEffectiveDate));
            BudgetLimitHistory applicableLimit = budgetLimitHistories.get(0);
            for(BudgetLimitHistory budgetLimitHistory : budgetLimitHistories){
                LocalDate effectiveDate = budgetLimitHistory.getEffectiveDate();
                if(effectiveDate.isBefore(date.plusMonths(1))){
                    applicableLimit = budgetLimitHistory;
                } else {
                    break;
                }
            }

            budgetGraphResponse.setLimitAmount(applicableLimit.getLimitAmount());
            if(applicableLimit.getLimitAmount().compareTo(budgetGraphResponse.getSpentAmount()) > 0){
                budgetGraphResponse.setRemainAmount(applicableLimit.getLimitAmount().subtract(budgetGraphResponse.getSpentAmount()));
            } else {
                budgetGraphResponse.setRemainAmount(BigDecimal.ZERO);
            }
            res.add(budgetGraphResponse);
        }
        return res;
    }

    @Override
    public List<Exchange> createWalletSavingExchange(ExchangeDTO exchangeDTO) {
        Wallet sendingWallet = walletService.getWalletById(exchangeDTO.getWalletId());
        Saving saving = savingService.getBySavingId(exchangeDTO.getDestinationId());

        ExchangeType exchangeType1 = new ExchangeType();
        if(exchangeDTO.getExchangeTypeId() != null){
            exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).orElseThrow(() -> new IllegalArgumentException("Exchange Type is invalid!"));
        }

        savingService.updateSavingFromExchange(exchangeDTO);
        String from = "";
        String to = "";
        if(exchangeType1.getExchangeTypeId().equals("wallet_saving")){
            if(sendingWallet.getType().equals("credit")){
                throw new IllegalArgumentException("Can not send money from Credit Card, Credit only receive money!");
            }
            if(sendingWallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0){
                throw new RuntimeException("SendingWallet: " + sendingWallet.getName() + " not enough money!");
            }
            sendingWallet.setAmount(sendingWallet.getAmount().subtract(exchangeDTO.getAmount()));
            from = sendingWallet.getName();
            to = saving.getName();
        }
        if(exchangeType1.getExchangeTypeId().equals("saving_wallet")){
            sendingWallet.setAmount(sendingWallet.getAmount().add(exchangeDTO.getAmount()));
            from = saving.getName();
            to = sendingWallet.getName();
        }
        sendingWallet.setUpdatedAt(new Date());
//        saving.setCurrentAmount(saving.getCurrentAmount().add(exchangeDTO.getAmount()));
//        saving.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(sendingWallet);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeType1)
                .from(from)
                .to(to)
                .exchangeDate(exchangeDTO.getExchangeDate())
                .description(exchangeDTO.getDescription())
                .amount(exchangeDTO.getAmount())
                .repeatTimeUnit(exchangeDTO.getRepeatTimeUnit())
                .repeatNumberPerUnit(exchangeDTO.getRepeatNumberPerUnit())
                .repeatNumber(exchangeDTO.getRepeatNumber())
                .category(null)
                .imageUrl(exchangeDTO.getImageUrl())
                .alarmDate(exchangeDTO.getAlarmDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        exchangeRepo.save(newExchange);
        return getAllExchangesByUserId(exchangeDTO.getUserId());
    }

    @Override
    public List<Exchange> getAllExchangeByExchangeType(String type) {
        List<Exchange> exchanges = new ArrayList<>();
        String type1 = type + "_wallet";
        String type2 = "wallet_" + type;
        exchanges.addAll(exchangeRepo.findAllByExchangeType_ExchangeTypeId(type1));
        exchanges.addAll(exchangeRepo.findAllByExchangeType_ExchangeTypeId(type2));
        return exchanges;
    }

    @Override
    public List<Exchange> getAllExchangesBySavingId(UUID savingId) {
        List<Exchange> exchanges = exchangeRepo.findAllByDestinationId(savingId);
        return exchanges;
    }

    @Override
    public List<SavingHistoryDTO> getAllSavingHistory(UUID savingId) {
        Saving saving = savingService.getBySavingId(savingId);
        List<Exchange> exchanges = getAllExchangesBySavingId(savingId);
        List<SavingHistoryDTO> histories = new ArrayList<>();
        exchanges.sort(Comparator.comparing(Exchange::getExchangeDate).reversed());
        BigDecimal currentAmount = saving.getCurrentAmount();
        LocalDate startDate = saving.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        histories.add(new SavingHistoryDTO(currentAmount, LocalDate.now()));
        Stack<LocalDate> stackTimes = CalculateTimes.calculatePreviousHistoryDate(startDate, LocalDate.now(), saving.getReceiveInterestTime());
        if(!stackTimes.isEmpty()){
            histories.add(new SavingHistoryDTO(currentAmount, stackTimes.pop()));
        }
        while(!stackTimes.isEmpty() || !exchanges.isEmpty()){
            if(!exchanges.isEmpty() && (stackTimes.isEmpty() || stackTimes.peek().isBefore(exchanges.get(0).getExchangeDate().toLocalDate()))){
                long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
                BigDecimal rate = (divider > 0) ? saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                // THêm logic cho những exchange chuyển tiền ra ngoài nữa
                String exchangeType = exchanges.get(0).getExchangeType().getExchangeTypeId();
                BigDecimal previousAmount = exchangeType.equals("wallet_saving") ?
                        currentAmount.subtract(exchanges.get(0).getAmount())
                        : currentAmount.add(exchanges.get(0).getAmount()) ;
                if(!stackTimes.isEmpty()){
                    if(exchangeType.equals("wallet_saving")){
                        currentAmount = previousAmount.divide(BigDecimal.ONE.add(rate), 10, RoundingMode.HALF_UP);
                        histories.add(new SavingHistoryDTO(currentAmount, stackTimes.pop()));

                        histories.add(new SavingHistoryDTO(currentAmount.add(exchanges.get(0).getAmount()), exchanges.get(0).getExchangeDate().toLocalDate()));
                        log.info("Wallet - Saving work");
                    } else {
                        currentAmount = currentAmount.divide(BigDecimal.ONE.add(rate), 10, RoundingMode.HALF_UP);
                        histories.add(new SavingHistoryDTO(currentAmount.add(exchanges.get(0).getAmount()), stackTimes.pop()));

                        histories.add(new SavingHistoryDTO(currentAmount, exchanges.get(0).getExchangeDate().toLocalDate()));
                        log.info("Saving - Wallet work");
                    }
                } else {
                    currentAmount = previousAmount;
                    log.info("Exchange work");
                    histories.add(new SavingHistoryDTO(currentAmount, exchanges.get(0).getExchangeDate().toLocalDate()));
                }
                exchanges.remove(0);
            } else {
                log.info("Stack work");
                long divider = CalculateTimes.calculatePeriodsBetween(startDate, startDate.plusYears(1), saving.getReceiveInterestTime());
                BigDecimal rate = (divider > 0) ? saving.getInterestRate().divide(BigDecimal.valueOf(100).multiply(BigDecimal.valueOf(divider)), 10, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                if(!saving.getSavingType().equals(SavingType.SIMPLE_INTEREST)){
                    log.info("COMPOUND INTEREST");
                    currentAmount = currentAmount.divide(BigDecimal.ONE.add(rate), 10, RoundingMode.HALF_UP);
                } else {
                    log.info("SIMPLE INTEREST");
                    currentAmount = currentAmount.subtract(saving.getOriginAmount().multiply(rate));
                }
                histories.add(new SavingHistoryDTO(currentAmount, stackTimes.pop()));
            }
        }
        histories.sort(Comparator.comparing(SavingHistoryDTO::getExchangeDate));
        return histories;
    }

    @Override
    public List<OverviewWalletDTO> getWalletChangesInLast30Days(String userId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);

        List<OverviewWalletDTO> changes = new ArrayList<>();
        BigDecimal totalAmount = walletService.getCurrentTotalAmount(userId);

        for (LocalDate date = endDate; !date.isBefore(startDate); date = date.minusDays(1)) {
            OffsetDateTime startOfDay = date.atStartOfDay().atOffset(ZoneOffset.UTC);
            OffsetDateTime endOfDay = date.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

            List<Exchange> exchanges = exchangeRepo.findAllByExchangeDateBetween(startOfDay, endOfDay);
            for (Exchange exchange : exchanges) {
                switch (exchange.getExchangeType().getExchangeTypeId()) {
                    case "income":
                    case "saving_wallet":
                    case "debt_wallet":
                    case "loan_wallet":
                        totalAmount = totalAmount.subtract(exchange.getAmount());
                        break;
                    case "spend":
                    case "wallet_saving":
                    case "wallet_debt":
                    case "wallet_loan":
                        totalAmount = totalAmount.add(exchange.getAmount());
                        break;
                }
            }

            changes.add(new OverviewWalletDTO(totalAmount, date));
        }

        return changes;
    }

    @Override
    public List<OverviewExchangeBudgetDTO> getExchangeBudgetChanges(String userId) {
        List<Exchange> exchanges = getAllExchangesByUserId(userId);
        // Filter exchanges by exchangeTypeId spend and income
        List<Exchange> filteredExchanges = exchanges.stream()
                .filter(exchange -> "spend".equals(exchange.getExchangeType().getExchangeTypeId()) ||
                        "income".equals(exchange.getExchangeType().getExchangeTypeId()))
                .collect(Collectors.toList());

        // Group exchanges by BudgetCategory and map to DTO
        Map<BudgetCategory, List<Exchange>> groupedByBudgetCategory = filteredExchanges.stream()
                .collect(Collectors.groupingBy(Exchange::getCategory));

        List<OverviewExchangeBudgetDTO> result = new ArrayList<>();

        groupedByBudgetCategory.forEach((budgetCategory, exchangeList) -> {
            exchangeList.forEach(exchange -> {
                OverviewExchangeBudgetDTO dto = new OverviewExchangeBudgetDTO();
                dto.setAmount(exchange.getAmount());
                dto.setExchangeDate(exchange.getExchangeDate().toLocalDate());
                dto.setBudgetCategory(budgetCategory);
                dto.setExchangeType(exchange.getExchangeType().getExchangeTypeId());
                result.add(dto);
            });
        });

        return result;
    }

    @Override
    public List<Exchange> getAllLast30daysUserExchanges(String userId) {
        List<Exchange> exchanges = getAllExchangesByUserId(userId);

        OffsetDateTime endDate = OffsetDateTime.now().plusDays(1);
        System.out.println("Date start");
        System.out.println(endDate);
        OffsetDateTime startDate = endDate.minusDays(31);

        return exchanges.stream().filter(exchange -> exchange.getExchangeDate().isAfter(startDate)
                                && exchange.getExchangeDate().isBefore(endDate))
                .collect(Collectors.toList());
    }

    @Override
    public SavingOverviewGraphResponse getSavingOverviewInOneMonth(String userId) {

        List<Exchange> exchanges = getAllLast30daysUserExchanges(userId).stream()
                .filter(exchange -> exchange.getExchangeType().getExchangeTypeId().equals("wallet_saving")
                        || exchange.getExchangeType().getExchangeTypeId().equals("saving_wallet"))
                .collect(Collectors.toList());

        List<Saving> savings = savingService.getAllByUserId(userId);

        Integer totalSavingAccount = 0;
        BigDecimal totalSavingAmount = BigDecimal.ZERO;
        BigDecimal totalIncomeAmount = BigDecimal.ZERO;
        BigDecimal totalOutcomeAmount = BigDecimal.ZERO;
        for(Saving saving : savings){
            UUID savingId = saving.getSavingId();
            Saving savingAccount = savingService.getBySavingId(savingId);
            totalSavingAccount++;
            totalSavingAmount = totalSavingAmount.add(savingAccount.getCurrentAmount());
        }
        for (Exchange exchange : exchanges){
            if(exchange.getExchangeType().getExchangeTypeId().equals("wallet_saving")){
                totalIncomeAmount= totalIncomeAmount.add(exchange.getAmount());
            } else {
                totalOutcomeAmount = totalOutcomeAmount.add(exchange.getAmount());
            }
        }
        SavingOverviewGraphResponse response = SavingOverviewGraphResponse.builder()
                .totalCurrentAmount(totalSavingAmount)
                .totalSavingAccount(totalSavingAccount)
                .totalIncomeSavingAmount(totalIncomeAmount)
                .totalOutcomeSavingAmount(totalOutcomeAmount)
                .build();

        return response;
    }

    @Override
    public List<Exchange> createWalletLoanExchange(ExchangeDTO exchangeDTO) {
        Wallet wallet = walletService.getWalletById(exchangeDTO.getWalletId());

        if(wallet.getType().equals("credit") && exchangeDTO.getExchangeTypeId().equals("wallet_loan")){
            throw new IllegalArgumentException("Can not send money from Credit Card, Credit only receive money!");
        }

        if(exchangeDTO.getExchangeTypeId() != null){
            Optional<ExchangeType> exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId());
            if(exchangeType1.isEmpty()){
                throw new IllegalArgumentException("Exchange Type is invalid!");
            }
        }
        if(exchangeDTO.getExchangeTypeId().equals("wallet_loan")){
            if(wallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0){
                throw new RuntimeException("SendWallet: " + wallet.getName() + " not enough money!");
            }
            wallet.setAmount(wallet.getAmount().subtract(exchangeDTO.getAmount()));
        } else {
            wallet.setAmount(wallet.getAmount().add(exchangeDTO.getAmount()));
        }
        wallet.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(wallet);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).get())
                .from(wallet.getName())
                .to(exchangeDTO.getTo())
                .exchangeDate(exchangeDTO.getExchangeDate())
                .description(exchangeDTO.getDescription())
                .amount(exchangeDTO.getAmount())
                .repeatTimeUnit(exchangeDTO.getRepeatTimeUnit())
                .repeatNumberPerUnit(exchangeDTO.getRepeatNumberPerUnit())
                .repeatNumber(exchangeDTO.getRepeatNumber())
                .category(null)
                .imageUrl(exchangeDTO.getImageUrl())
                .alarmDate(exchangeDTO.getAlarmDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        if(exchangeDTO.getExchangeTypeId().equals("loan_wallet")){
            newExchange.setFrom(exchangeDTO.getTo());
            newExchange.setTo(wallet.getName());
        }
        exchangeRepo.save(newExchange);
        return getAllExchangesByUserId(exchangeDTO.getUserId());
    }

    @Override
    public List<Exchange> createWalletDebtExchange(ExchangeDTO exchangeDTO) {
        Wallet wallet = walletService.getWalletById(exchangeDTO.getWalletId());

        if(wallet.getType().equals("credit") && exchangeDTO.getExchangeTypeId().equals("wallet_debt")){
            throw new IllegalArgumentException("Can not send money from Credit Card, Credit only receive money!");
        }

        if(exchangeDTO.getExchangeTypeId() != null){
            Optional<ExchangeType> exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId());
            if(exchangeType1.isEmpty()){
                throw new IllegalArgumentException("Exchange Type is invalid!");
            }
        }

        if(exchangeDTO.getExchangeTypeId().equals("wallet_debt")){
            if(wallet.getAmount().compareTo(exchangeDTO.getAmount()) < 0){
                throw new RuntimeException("SendWallet: " + wallet.getName() + " not enough money!");
            }
            wallet.setAmount(wallet.getAmount().subtract(exchangeDTO.getAmount()));
        } else {
            wallet.setAmount(wallet.getAmount().add(exchangeDTO.getAmount()));
        }
        wallet.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(wallet);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).get())
                .from(exchangeDTO.getFrom())
                .to(wallet.getName())
                .exchangeDate(exchangeDTO.getExchangeDate())
                .description(exchangeDTO.getDescription())
                .amount(exchangeDTO.getAmount())
                .repeatTimeUnit(exchangeDTO.getRepeatTimeUnit())
                .repeatNumberPerUnit(exchangeDTO.getRepeatNumberPerUnit())
                .repeatNumber(exchangeDTO.getRepeatNumber())
                .category(null)
                .imageUrl(exchangeDTO.getImageUrl())
                .alarmDate(exchangeDTO.getAlarmDate())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
        if(exchangeDTO.getExchangeTypeId().equals("wallet_debt")){
            newExchange.setFrom(wallet.getName());
            newExchange.setTo(exchangeDTO.getFrom());
        }
        exchangeRepo.save(newExchange);
        return getAllExchangesByUserId(exchangeDTO.getUserId());

    }
}
