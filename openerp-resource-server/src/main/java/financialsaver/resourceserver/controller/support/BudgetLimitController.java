package financialsaver.resourceserver.controller.support;

import lombok.AllArgsConstructor;
import financialsaver.resourceserver.service.BudgetLimitHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/budget-limit")
@AllArgsConstructor(onConstructor_ = @Autowired)
public class BudgetLimitController {
    private BudgetLimitHistoryService budgetLimitHistoryService;
}
