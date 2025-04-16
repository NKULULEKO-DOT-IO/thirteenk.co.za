import { FC } from 'react';
import { DownloadCounterProps } from '@/types/shared/download-counter.types';
import { useTranslations } from 'next-intl';

const DownloadCounter: FC<DownloadCounterProps> = ({
                                                     totalDownloads,
                                                     isLoading,
                                                     className = '',
                                                     label,
                                                     variant = 'default'
                                                   }) => {
  const t = useTranslations('Common');
  const displayLabel = label || t('totalDownloads');

  // Format the number with commas
  const formattedDownloads = totalDownloads.toLocaleString();

  // Determine component styling based on variant
  const containerClasses =
    variant === 'compact'
      ? `inline-flex items-center rounded-md bg-gray-100 px-3 py-1 ${className}`
      : `flex items-center rounded-full bg-gray-100 px-4 py-2 ${className}`;

  const labelClasses =
    variant === 'compact'
      ? 'mr-1 text-xs text-gray-600'
      : 'mr-2 text-sm';

  const valueClasses =
    variant === 'compact'
      ? 'font-medium'
      : 'font-bold';

  return (
    <div className={containerClasses}>
      <span className={labelClasses}>{displayLabel}</span>
      <span className={valueClasses}>
        {isLoading ? '...' : formattedDownloads}
      </span>
    </div>
  );
};

export default DownloadCounter;