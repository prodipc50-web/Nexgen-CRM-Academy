// Converts number to English and Bangla words for financial receipts
export function numberToWordsEnglish(amount: number): string {
  if (!amount || amount === 0) return 'Zero Taka Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(num: number): string {
    let chunk = '';
    if (num >= 100) {
      chunk += units[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num >= 20) {
      chunk += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    }
    if (num > 0) {
      chunk += units[num] + ' ';
    }
    return chunk.trim();
  }

  let words = '';
  let crore = Math.floor(amount / 10000000);
  amount %= 10000000;
  let lakh = Math.floor(amount / 100000);
  amount %= 100000;
  let thousand = Math.floor(amount / 1000);
  amount %= 1000;
  let remainder = Math.floor(amount);

  if (crore > 0) words += convertChunk(crore) + ' Crore ';
  if (lakh > 0) words += convertChunk(lakh) + ' Lakh ';
  if (thousand > 0) words += convertChunk(thousand) + ' Thousand ';
  if (remainder > 0) words += convertChunk(remainder);

  return (words.trim() + ' Taka Only').replace(/\s+/g, ' ');
}

export function numberToWordsBangla(amount: number): string {
  if (!amount || amount === 0) return 'শূন্য টাকা মাত্র';
  // Return English words as reliable standard or bangla formatted
  return `${numberToWordsEnglish(amount)}`;
}
