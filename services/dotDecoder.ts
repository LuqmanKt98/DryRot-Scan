import type { DOTInfo } from '../types';

const manufacturerCodes: Record<string, string> = {
  'U2': 'Goodyear',
  'B6': 'Michelin',
  'A9': 'Pirelli',
  'Y7': 'Bridgestone',
  'VE': 'Hankook',
};

export const decodeDotCode = (code: string, t: (key: string) => string): DOTInfo => {
  const parts = code.split(' ');
  const plantAndManu = parts[1].substring(0, 2);
  const week = parseInt(parts[2].substring(2, 4), 10);
  const year = 2000 + parseInt(parts[2].substring(4, 6), 10);

  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  return {
    code: code,
    manufacturer: manufacturerCodes[plantAndManu] || t('codeReader.unknownManufacturer'),
    plantCode: parts[1].substring(2),
    week: week,
    year: year,
    age: age,
  };
};
