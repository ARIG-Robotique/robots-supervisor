import { format, parseISO } from 'date-fns';
import FR from 'date-fns/locale/fr';

export function formatDate(date: Date | string, formatStr: string) {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  if (date) {
    return format(date, formatStr, {locale: FR});
  }
  return '';
}
