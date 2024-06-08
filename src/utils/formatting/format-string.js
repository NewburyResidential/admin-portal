export function fToCamelCase(str) {
    return str
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

export function fRemoveSpaces(str) {
    return str.replace(/\s+/g, '');
}

export function fRemoveExtension(str) {
    return str.replace(/\.[^/.]+$/, '');
}