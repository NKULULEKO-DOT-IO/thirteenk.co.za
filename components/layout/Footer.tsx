import { FC } from 'react';
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
                                   children
                                 }) => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  const copyright = copyrightText || t('copyrightText') || `© ${currentYear} Thirteenk. All rights reserved.`;

  return (
    <footer className={`py-8 border-t border-gray-100 ${className}`}>
      <div className="container mx-auto px-4">

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