export function formatNumber(number) {
  return parseFloat(number).toLocaleString('ru');
}

export function formatCurrency(sum) {
  return formatNumber(sum) + '₽';
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const diffDays = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24));
  switch (diffDays) {
    case 0: return 'Сегодня';
    case 1: return 'Вчера';
    case 2: return '2 дня назад';
    default: return date.toLocaleDateString('ru');
  }
}
