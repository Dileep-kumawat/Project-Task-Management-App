export function formatDate(str) {
    if (!str) return "";
    const d = new Date(str);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}