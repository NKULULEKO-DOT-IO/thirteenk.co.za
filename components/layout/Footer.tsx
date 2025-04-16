import { FC } from 'react';
import { Link } from '@/i18n/navigation';
import { FooterProps } from '@/types/layout/footer.types';
import { useTranslations } from 'next-intl';

/**
 * Footer component for the application
 *
 * @example
 * // Basic usage
 * <Footer />
 *
 * @example
 * // With custom sections
 * <Footer
 *   sections={[
 *     {
 *       title: 'About',
 *       links: [
 *         { label: 'Our Story', href: '/about' },
 *         { label: 'Team', href: '/team' },
 *       ]
 *     },
 *     {
 *       title: 'Legal',
 *       links: [
 *         { label: 'Privacy', href: '/privacy' },
 *         { label: 'Terms', href: '/terms' },
 *       ]
 *     }
 *   ]}
 * />
 */
const Footer: FC<FooterProps> = ({
                                   className = '',
                                   copyrightText,
                                   showBusinessPlanLink = true,
                                   children
                                 }) => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  const copyright = copyrightText || t('copyrightText') || `© ${currentYear} Thirteenk. All rights reserved.`;

  return (
    <footer className={`py-8 border-t border-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Business plan link */}
        {showBusinessPlanLink && (
          <div className="mt-8 text-center">
            <Link
              className="py-2 px-6 shadow-md rounded-md bg-blue-100 inline-block hover:bg-blue-200 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/document/d/1o0tT70ECWV11YB4oYH9RkkdllyLeO_ld8CEwGE3wlAg/edit?usp=sharing"
            >
              {t('businessPlan') || 'View Open Source Business Plan'}
            </Link>
          </div>
        )}

        {/* Children content if provided */}
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}

        {/* Copyright section */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;