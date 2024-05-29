package openerp.openerpresourceserver.service.impl;

import com.cloudinary.Cloudinary;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import openerp.openerpresourceserver.dto.ExchangeDTO;
import openerp.openerpresourceserver.entity.Exchange;
import openerp.openerpresourceserver.entity.Saving;
import openerp.openerpresourceserver.entity.Wallet;
import openerp.openerpresourceserver.entity.support.BudgetCategory;
import openerp.openerpresourceserver.entity.support.ExchangeType;
import openerp.openerpresourceserver.repo.ExchangeRepo;
import openerp.openerpresourceserver.repo.support.ExchangeTypeRepo;
import openerp.openerpresourceserver.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
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

    @Override
    public List<Exchange> getAllExchanges() {
        return exchangeRepo.findAll();
    }

    @Override
    public List<Exchange> getAllUserExchanges(String userId) {
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
        return getAllUserExchanges(exchangeDTO.getUserId());
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
        return getAllUserExchanges(exchangeDTO.getUserId());
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
        return getAllUserExchanges(exchangeDTO.getUserId());
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
                case "income":
                    walletService.updateWalletAfterUpdateExchange(walletId, amount.negate());
                    break;
                case "spend":
                    walletService.updateWalletAfterUpdateExchange(walletId, amount);
                    break;
//            case "loan_wallet":
//            case "wallet_loan":
//                break;
//            case "debt_wallet":
//            case "wallet_debt":
//                break;
//            case "saving_wallet":
//            case "wallet_saving":
//                break;
                default:
                    // Handle invalid exchangeType (throw exception, return error response, etc.)
                    throw new IllegalArgumentException("Invalid exchange type: " + exchangeType);
            }
            exchangeRepo.delete(exchange);
            return getAllUserExchanges(userId);
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
            if (exchangeDTO.getCategory() != null) {
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
            UUID newDestinationId = exchangeDTO.getDestinationId();
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
//            case "loan_wallet":
//            case "wallet_loan":
//                break;
//            case "debt_wallet":
//            case "wallet_debt":
//                break;
//            case "saving_wallet":
//            case "wallet_saving":
//                break;
                default:
                    // Handle invalid exchangeType (throw exception, return error response, etc.)
                    throw new IllegalArgumentException("Invalid exchange type: " + exchangeType);
            }
            exchangeRepo.save(exchange);
            return getAllUserExchanges(userId);
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
        List<Exchange> allExchanges = getAllUserExchanges(userId);

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
    public List<Exchange> createWalletSavingExchange(ExchangeDTO exchangeDTO) {
        Wallet sendingWallet = walletService.getWalletById(exchangeDTO.getWalletId());
        Saving saving = savingService.getBySavingId(exchangeDTO.getDestinationId());

        if(sendingWallet.getType().equals("credit")){
            throw new IllegalArgumentException("Can not send money from Credit Card, Credit only receive money!");
        }
        ExchangeType exchangeType1 = new ExchangeType();
        if(exchangeDTO.getExchangeTypeId() != null){
            exchangeType1 = exchangeTypeRepo.findById(exchangeDTO.getExchangeTypeId()).orElseThrow(() -> new IllegalArgumentException("Exchange Type is invalid!"));
        }
//        Optional<BudgetCategory> budgetCategory = budgetService.getBudgetById(exchangeDTO.getCategory());
//        if(budgetCategory.isEmpty()){
//            throw new IllegalArgumentException("Budget Category Id is invalid!");
//        }
        sendingWallet.setAmount(sendingWallet.getAmount().subtract(exchangeDTO.getAmount()));
        sendingWallet.setUpdatedAt(new Date());
//        saving.setCurrentAmount(saving.getCurrentAmount().add(exchangeDTO.getAmount()));
//        saving.setUpdatedAt(new Date());
        walletService.updateWalletFromExchange(sendingWallet);
        savingService.updateSavingFromExchange(exchangeDTO);

        Exchange newExchange = Exchange
                .builder()
//                .exchangeId(UUID.randomUUID())
                .wallet(walletService.getWalletById(exchangeDTO.getWalletId()))
                .user(userService.getUserById(exchangeDTO.getUserId()))
                .destinationId(exchangeDTO.getDestinationId())
                .exchangeType(exchangeType1)
                .from(sendingWallet.getName())
                .to(saving.getName())
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
        return getAllUserExchanges(exchangeDTO.getUserId());
    }

    @Override
    public List<Exchange> createSavingWalletExchange(ExchangeDTO exchangeDTO) {
        return null;
    }
}
