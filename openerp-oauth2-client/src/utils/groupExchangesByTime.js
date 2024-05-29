export function groupExchangesByTime(exchanges) {
    const exchangesByTime = {
        'Hôm nay': [],
        'Hôm qua': [],
        'Tuần này': [],
        'Tháng này': [],
        'Tháng trước': [],
        'Năm nay': [],
        'Năm trước': [],
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1); // Chỉnh sửa đây

    exchanges.forEach((exchange) => {
        const exchangeDate = new Date(exchange.exchangeDate);
        if (isSameDay(exchangeDate, today)) {
            exchangesByTime['Hôm nay'].push(exchange);
        } else if (isSameDay(exchangeDate, yesterday)) {
            exchangesByTime['Hôm qua'].push(exchange);
        } else if (exchangeDate >= startOfWeek) {
            exchangesByTime['Tuần này'].push(exchange);
        } else if (exchangeDate >= startOfMonth) {
            exchangesByTime['Tháng này'].push(exchange);
        } else if (exchangeDate >= startOfLastMonth) {
            exchangesByTime['Tháng trước'].push(exchange);
        } else if (exchangeDate >= startOfYear) {
            exchangesByTime['Năm nay'].push(exchange);
        } else if (exchangeDate <= startOfYear) {
            exchangesByTime['Năm trước'].push(exchange);
        }
    });

    return exchangesByTime;
}

export function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}