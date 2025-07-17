

export const apartmentFormatRegex = {
  cemc: /^\d+\s[A-Z]+(?:\s[A-Z]+)*\sLN\sAPT\s\d+$/i,
  townofashlandcitytnwater: /^\d+\s[A-Z]+(?:\s[A-Z]+)*\sLN\s#\s\d+$/i,
  bwl: /^\d+\sAPT\s\d+$/i,
  cpws: /^\d{1,3}-\d{1,3}$/,
  brightridge: /^\d{1,3}$/,
  mte: /^(?:[1-9]\d{0,2}|502)$/,
  entergy: /^[A-Z]\d+$/i,
};
