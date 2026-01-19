import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { User } from '@/app/actions/users';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the user's display name.
 * Priority: "FirstName LastName" > firstName > email prefix
 */
export function getUserDisplayName(user?: User | null): string {
  if (!user) {
    return 'Usuario';
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  return user.email.split('@')[0];
}

/**
 * Returns the user's initials for avatars.
 * Priority: First letter of firstName > first letter of email
 */
export function getUserInitials(user?: User | null): string {
  if (!user) {
    return '?';
  }

  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }

  return user.email.charAt(0).toUpperCase();
}
