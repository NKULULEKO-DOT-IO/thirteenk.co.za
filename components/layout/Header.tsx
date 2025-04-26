import { FC } from 'react';
import { Link } from '@/i18n/navigation';
import DownloadCounter from '@/components/shared/DownloadCounter';
import { HeaderProps } from '@/types/layout/header.types';

const Header: FC<HeaderProps> = ({
                                   totalDownloads,
                                   isLoading,
                                   className = '',
                                   title = 'THIRTEENK',
                                   locales = [
                                     { code: 'en', label: 'EN' },
                                     { code: 'zu', label: 'ZU' }
                                   ]
                                 }) => {
  return (
    <header className={`py-6 border-b border-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-light uppercase tracking-wider">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
              <Link
                  className="mx-1 text-sm py-2 px-4 shadow-md rounded-md bg-blue-100 inline-block hover:bg-blue-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.google.com/document/d/1o0tT70ECWV11YB4oYH9RkkdllyLeO_ld8CEwGE3wlAg/edit?usp=sharing"
              >
                  {'View Business Plan'}
              </Link>
            <DownloadCounter
              totalDownloads={totalDownloads}
              isLoading={isLoading}
            />
            <div>
              {locales.map((locale, index) => (
                <span key={locale.code}>
                  <Link
                    href="/"
                    locale={locale.code}
                    className="mx-1 text-sm hover:text-blue-600"
                  >
                    {locale.label}
                  </Link>
                  {index < locales.length - 1 && (
                    <span className="mx-1 text-gray-300">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;