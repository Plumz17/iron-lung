/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

/**
 * Menyimpan access token ke localStorage
 * @param {string} token - JWT Access Token
 */
export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

/**
 * Mengambil access token dari localStorage
 * @returns {string | null} JWT Access Token
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

/**
 * Menghapus access token dari localStorage (Logout)
 */
export const removeAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};
