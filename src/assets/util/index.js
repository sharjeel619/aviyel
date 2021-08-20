const parseInvoiceString = (val) => {
    const spl = val.split("INV")
    return `INV. # - ${spl[1]}`
}
const calculateTotalPrice = (invoiceData) => {
    const { items, tax_percentage, discount_percentage } = invoiceData
    const subTotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
    const tax = (subTotal * (Number(tax_percentage) * 0.01))
    const discount = (subTotal * (Number(discount_percentage) * 0.01))
    const grandTotal = ((subTotal + tax) - discount)
    return [subTotal, tax, discount, grandTotal]
}
const addCommaToPrice = (val) => {
    return Number(val).toFixed(2).toLocaleString()
}
const unixDateParser = (val) => {
    let dateTime = new Date(Number(val))
    let [date, time] = dateTime.toLocaleString().split(", ")
    time = time.split(/:| /g)
    return `${time[0]}:${time[1]} ${time[3]} - ${date}`
}
export { parseInvoiceString, calculateTotalPrice, unixDateParser, addCommaToPrice }