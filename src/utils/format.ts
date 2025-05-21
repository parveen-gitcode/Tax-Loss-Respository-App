/**
 * Format a number as currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number with appropriate decimal places
 */
export const formatNumber = (value: number): string => {
  if (Math.abs(value) < 0.000001) {
    return '0';
  }
  
  if (Math.abs(value) < 0.001) {
    return value.toExponential(2);
  }
  
  if (Math.abs(value) < 1) {
    return value.toFixed(6);
  }
  
  if (Math.abs(value) < 10) {
    return value.toFixed(4);
  }
  
  if (Math.abs(value) < 1000) {
    return value.toFixed(2);
  }
  
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 2
  }).format(value);
};