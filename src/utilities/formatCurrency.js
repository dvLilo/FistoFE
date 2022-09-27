export const formatCurrency = (data) => {
  return data.toLocaleString("default", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}