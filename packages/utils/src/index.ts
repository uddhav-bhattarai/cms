import { Permission } from '@bakery-erp/types';

/**
 * Formats permission into string format "resource:action"
 */
export function formatPermissionKey(permission: Permission): string {
  return `${permission.resource}:${permission.action}`;
}

/**
 * Checks if user has required permission
 * @param userPermissions - Array of permission strings ["resource:action"]
 * @param requiredPermission - Required permission string "resource:action"
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  // SUPER_ADMIN bypasses all checks
  if (userPermissions.includes('*:*')) {
    return true;
  }
  
  const [resource, action] = requiredPermission.split(':');
  
  // Check exact match
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }
  
  // Check wildcard resource (e.g., "inventory:*")
  if (userPermissions.includes(`${resource}:*`)) {
    return true;
  }
  
  // Check wildcard action (e.g., "*:read")
  if (userPermissions.includes(`*: ${action}`)) {
    return true;
  }
  
  return false;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes string to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Generates a random string for tokens/IDs
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Formats currency value
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats date to ISO string without milliseconds
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Calculates order totals
 */
export function calculateOrderTotals(
  items: Array<{ quantity: number; unitPrice: number; discount: number }>,
  taxRate: number = 0.08
): { subtotal: number; tax: number; discount: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  
  const discount = items.reduce(
    (sum, item) => sum + item.discount,
    0
  );
  
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extracts IP address from request headers (Node.js)
 */
export function extractIpAddress(headers: Record<string, any>): string {
  return (
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['x-real-ip'] ||
    headers['cf-connecting-ip'] ||
    'unknown'
  );
}
