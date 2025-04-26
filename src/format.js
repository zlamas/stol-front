export function formatNumber(number) {
  return parseFloat(number).toLocaleString('ru');
}

export function formatCurrency(sum) {
  return formatNumber(sum) + '₽';
}
