// Utilitário para máscara de telefone brasileiro
export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limitedNumbers = numbers.slice(0, 11);
  
  // Aplica a máscara conforme o número de dígitos
  if (limitedNumbers.length <= 2) {
    return `(${limitedNumbers}`;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
};

// Remove a máscara para enviar apenas números
export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Valida se o telefone está completo (11 dígitos)
export const isValidPhoneNumber = (value: string): boolean => {
  const numbers = removePhoneMask(value);
  return numbers.length === 11;
};
