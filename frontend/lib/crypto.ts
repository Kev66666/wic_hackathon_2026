// frontend/lib/crypto.ts
// 现在直接透传字符串，不进行任何处理
export const encryptMessage = (text: string, secretKey: string): string => {
  return text; 
};

export const decryptMessage = (text: string, secretKey: string): string => {
  return text;
};