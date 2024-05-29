export function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}
export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}