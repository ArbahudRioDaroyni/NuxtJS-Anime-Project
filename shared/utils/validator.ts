export const useValidatorTest = () => {
  return 'test'
};

export const useNumberValidator = (value: unknown, defaultValue = NaN, min?: number, max?: number): number => {
  let num = Number(value);
  if (isNaN(num)) {
    return defaultValue;
  }
  if (min !== undefined && num < min) {
    num = min;
  }
  if (max !== undefined && num > max) {
    num = max;
  }
  return num;
};

export const useStringValidator = (value: unknown, defaultValue = '', maxLength?: number): string => {
  let str = String(value ?? defaultValue).trim();
  if (maxLength !== undefined && str.length > maxLength) {
    str = str.slice(0, maxLength);
  }
  return str;
};

export const useSlugValidator = (value: unknown, defaultValue = false): string | boolean => {
  const str = String(value ?? defaultValue).trim().toLowerCase();
  if (!/^[a-z0-9!.\s_-]+(?:-[a-z0-9!.\s_-]+)*$/.test(str)) {
    return defaultValue;
  }
  return str;
};