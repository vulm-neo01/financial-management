package openerp.openerpresourceserver.utils.time;

import openerp.openerpresourceserver.entity.support.ReceiveInterestTime;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Stack;

public class CalculateTimes {
    public static long calculatePeriodsBetween(LocalDate startDate, LocalDate currentDate, ReceiveInterestTime period) {
        switch (period) {
            case DAILY:
                return ChronoUnit.DAYS.between(startDate, currentDate);
            case WEEKLY:
                return ChronoUnit.WEEKS.between(startDate, currentDate);
            case MONTHLY:
                return ChronoUnit.MONTHS.between(startDate, currentDate);
            case EVERY_TWO_MONTH:
                return (ChronoUnit.MONTHS.between(startDate, currentDate))/2;
            case EVERY_THREE_MONTH:
                return (ChronoUnit.MONTHS.between(startDate, currentDate))/3;
            case EVERY_SIX_MONTH:
                return (ChronoUnit.MONTHS.between(startDate, currentDate))/6;
            case YEARLY:
                return ChronoUnit.YEARS.between(startDate, currentDate);
            case EMPTY:
                return 0;
            default:
                throw new IllegalArgumentException("Unknown period: " + period);
        }
    }

    public static LocalDate calculateNewStartDate(LocalDate startDate, LocalDate exchangeDate, ReceiveInterestTime period) {
        LocalDate newStartDate = startDate;
        if(period == ReceiveInterestTime.EMPTY){
            return newStartDate;
        }
        while (newStartDate.isBefore(exchangeDate) || newStartDate.isEqual(exchangeDate)) {
            switch (period) {
                case DAILY:
                    newStartDate = newStartDate.plusDays(1);
                    break;
                case WEEKLY:
                    newStartDate = newStartDate.plusWeeks(1);
                    break;
                case MONTHLY:
                    newStartDate = newStartDate.plusMonths(1);
                    break;
                case EVERY_TWO_MONTH:
                    newStartDate = newStartDate.plusMonths(2);
                    break;
                case EVERY_THREE_MONTH:
                    newStartDate = newStartDate.plusMonths(3);
                    break;
                case EVERY_SIX_MONTH:
                    newStartDate = newStartDate.plusMonths(6);
                    break;
                case YEARLY:
                    newStartDate = newStartDate.plusYears(1);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown period: " + period);
            }
        }

        return newStartDate;
    }

    public static LocalDate calculatePreviousInterestDate(LocalDate startDate, LocalDate exchangeDate, ReceiveInterestTime period) {
        LocalDate previousInterestDate = startDate;
        LocalDate nextInterestDate = startDate;
        if(period == ReceiveInterestTime.EMPTY){
            return previousInterestDate;
        }
        while (nextInterestDate.isBefore(exchangeDate) || nextInterestDate.isEqual(exchangeDate)) {
            previousInterestDate = nextInterestDate;
            switch (period) {
                case DAILY:
                    nextInterestDate = nextInterestDate.plusDays(1);
                    break;
                case WEEKLY:
                    nextInterestDate = nextInterestDate.plusWeeks(1);
                    break;
                case MONTHLY:
                    nextInterestDate = nextInterestDate.plusMonths(1);
                    break;
                case EVERY_TWO_MONTH:
                    nextInterestDate = nextInterestDate.plusMonths(2);
                    break;
                case EVERY_THREE_MONTH:
                    nextInterestDate = nextInterestDate.plusMonths(3);
                    break;
                case EVERY_SIX_MONTH:
                    nextInterestDate = nextInterestDate.plusMonths(6);
                    break;
                case YEARLY:
                    nextInterestDate = nextInterestDate.plusYears(1);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown period: " + period);
            }
        }

        return previousInterestDate;
    }

    public static Stack<LocalDate> calculatePreviousHistoryDate(LocalDate startDate, LocalDate currentDate, ReceiveInterestTime period) {
        LocalDate previousHistoryDate = startDate;
        LocalDate nextInterestDate = startDate;
        Stack<LocalDate> res = new Stack<>();
        if(period == ReceiveInterestTime.EMPTY){
            return res;
        }
        while (nextInterestDate.isBefore(currentDate) || nextInterestDate.isEqual(currentDate)) {
            previousHistoryDate = nextInterestDate;
            res.add(previousHistoryDate);
            switch (period) {
                case DAILY:
                    nextInterestDate = nextInterestDate.plusDays(1);
                    break;
                case WEEKLY:
                    nextInterestDate = nextInterestDate.plusWeeks(1);
                    break;
                case MONTHLY:
                    nextInterestDate = nextInterestDate.plusMonths(1);
                    break;
                case EVERY_TWO_MONTH:
                    nextInterestDate = nextInterestDate.plusMonths(2);
                    break;
                case EVERY_THREE_MONTH:
                    nextInterestDate = nextInterestDate.plusMonths(3);
                    break;
                case EVERY_SIX_MONTH:
                    nextInterestDate = nextInterestDate.plusMonths(6);
                    break;
                case YEARLY:
                    nextInterestDate = nextInterestDate.plusYears(1);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown period: " + period);
            }
        }

        return res;
    }

}
