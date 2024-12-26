import {
  Inject,
  LOCALE_ID,
  Optional,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  DATE_PIPE_DEFAULT_OPTIONS,
  DatePipeConfig,
  formatDate,
} from '@angular/common';

@Pipe({
  name: 'recencyDate',
  standalone: true,
})
export class RecencyDatePipe implements PipeTransform {
  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    @Inject(DATE_PIPE_DEFAULT_OPTIONS)
    @Optional()
    private defaultOptions?: DatePipeConfig | null
  ) {}

  transform(
    value: Date | string | number | undefined,
    timezone?: string,
    locale?: string
  ): string | null {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();

    const _timezone = timezone ?? this.defaultOptions?.timezone ?? undefined;

    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInHours < 24) {
      return formatDate(date, 'h:mm', locale || this.locale, _timezone) || '';
    }

    if (diffInDays < 7) {
      return formatDate(date, 'E', locale || this.locale, _timezone) || '';
    }

    return formatDate(value, 'd.M.y', locale || this.locale, _timezone);
  }
}
