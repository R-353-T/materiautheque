import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  /**
   * Now - ISO 8601 "YYYY-MM-DDTHH:mm:ssZ"
   * @returns 
   */
  getIsoDayNow() {
    const date = new Date();
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMinutesPart = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes > 0 ? '-' : '+';
    const offsetString = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutesPart).padStart(2, '0')}`;
    const localISOString = date.getFullYear() +
      '-' + String(date.getMonth() + 1).padStart(2, '0') +
      '-' + String(date.getDate()).padStart(2, '0') +
      'T' + "00" +
      ':' + "00" +
      ':' + "00";
    return localISOString;
  }

  /**
   * Convert ISO 8601 ("YYYY-MM-DDTHH:mm:ssZ") -> "YYYY-MM-DD hh:mm:ss"
   * @param isoDateString 
   * @returns 
   */
  isoToCustomFormat(date: string) {
    const isDate = new Date(date);
    const year = isDate.getFullYear();
    const month = String(isDate.getMonth() + 1).padStart(2, '0');
    const day = String(isDate.getDate()).padStart(2, '0');
    const hours = String(isDate.getHours()).padStart(2, '0');
    const minutes = String(isDate.getMinutes()).padStart(2, '0');
    const seconds = String(isDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Convert "YYYY-MM-DD hh:mm:ss" -> ISO 8601 ("YYYY-MM-DDTHH:mm:ssZ")
   * @param customDateString 
   * @returns "YYYY-MM-DDTHH:mm:ssZ"
   */
  public customFormatToIso(date: string) {
    const [datePart, timePart] = date.split(' ');
    const [year, month, day] = datePart.split('-').map(x => Number(x) < 10 ? `0${Number(x)}` : x);
    const [hours, minutes, seconds] = timePart.split(':').map(x => Number(x) < 10 ? `0${Number(x)}` : x);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}
