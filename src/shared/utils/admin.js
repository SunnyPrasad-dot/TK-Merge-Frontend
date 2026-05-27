import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getInitials(name) {
  if (!name) return "??";
  
  // Remove special characters like '&', '-', etc. and extra spaces
  const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  if (!cleanName) return "??";

  const words = cleanName.split(/\s+/);
  
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function formatCurrency(amount, currency = 'usd') {
  const value = amount || 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  } catch (e) {
    return `$${value.toLocaleString()}`;
  }
}
