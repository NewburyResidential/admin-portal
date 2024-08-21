import { format, getTime, formatDistanceToNow, parse, differenceInYears, differenceInMonths } from 'date-fns';

// ----------------------------------------------------------------------

export function fToLocaleDate(date, existingFormat = 'MM/dd/yyyy') {
  return parse(date, existingFormat, new Date());
}

export function fDate(date, newFormat) {
  const fm = newFormat || 'MM/dd/yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function getTodaysDate() {
  const now = new Date();
  return format(now, 'MM/dd/yyyy');
}

export function calculateAgeInYears(startDate) {
  const parsedDate = parse(startDate, 'MM/dd/yyyy', new Date());
  const today = new Date();
  return differenceInYears(today, parsedDate);
}

export function calculateAgeInMonths(startDate) {
  const parsedDate = parse(startDate, 'MM/dd/yyyy', new Date());
  const today = new Date();
  const totalMonths = differenceInMonths(today, parsedDate);
  return totalMonths % 12;
}
