import { formatDistance, parseISO, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatServerDateToDurationString = (dateString: string) => {
  const date = parseISO(dateString);
  return formatDistance(date, new Date(), { addSuffix: true, locale: vi });
};

export const formatServerDate = (dateString: string, formatString: string) => {
  if (dateString) {
    return format(parseISO(dateString), formatString);
  }

  return '';
};
