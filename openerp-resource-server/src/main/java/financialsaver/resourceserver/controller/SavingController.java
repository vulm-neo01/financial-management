package financialsaver.resourceserver.controller;

import financialsaver.resourceserver.entity.Saving;
import financialsaver.resourceserver.service.TransactionService;
import lombok.AllArgsConstructor;
import financialsaver.resourceserver.dto.SavingDTO;
import financialsaver.resourceserver.entity.support.SavingCategory;
import financialsaver.resourceserver.service.SavingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/savings")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class SavingController{
    private SavingService savingService;
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<?> getAllSavings(){
        List<Saving> savings = savingService.getAllSaving();
        return ResponseEntity.ok(savings);
    }

    @GetMapping("/{savingId}")
    public ResponseEntity<?> getById(@PathVariable UUID savingId){
        Saving saving = savingService.getBySavingId(savingId);
        return ResponseEntity.ok(saving);
    }

    @GetMapping("/category")
    public ResponseEntity<?> getAllCategory(){
        List<SavingCategory> categories = savingService.getAllSavingCategory();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllByUserId(@PathVariable String userId) {
        List<Saving> savings = savingService.getAllByUserId(userId);
        return ResponseEntity.ok(savings);
    }

    @DeleteMapping("/{savingId}")
    public ResponseEntity<?> removeSaving(@PathVariable UUID savingId) {
        List<Saving> savings = transactionService.removeSavingWithExchanges(savingId);
        return ResponseEntity.ok(savings);
    }

    @PostMapping
    public ResponseEntity<?> createNewSaving(@RequestBody SavingDTO savingDTO){
        List<Saving> savings = savingService.createSaving(savingDTO);
        return ResponseEntity.ok(savings);
    }

    @PatchMapping("/{savingId}")
    public ResponseEntity<?> updateSaving(@RequestBody SavingDTO savingDTO, @PathVariable UUID savingId){
        Saving saving = savingService.updateSaving(savingDTO, savingId);
        return ResponseEntity.ok(saving);
    }
}
