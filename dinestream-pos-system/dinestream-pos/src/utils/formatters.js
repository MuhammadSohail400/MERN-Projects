export const formatCurrency = (amount) => {
  return `PKR ${Number(amount).toLocaleString('en-PK')}`
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

export const formatOrderNumber = (num) => {
  return `#ORD-${String(num).padStart(4, '0')}`
}