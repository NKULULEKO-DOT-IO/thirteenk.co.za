import { FC } from 'react';
import Header from './Header';
import Footer from './Footer';
import { LayoutProps } from '@/types/layout/layout.types';

const Layout: FC<LayoutProps> = ({
                                   children,
                                   totalDownloads,
                                   isLoading,
                                   className = '',
                                   footerProps
                                 }) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header totalDownloads={totalDownloads} isLoading={isLoading} />
      <main className="flex-1">
        {children}
      </main>
      <Footer
        showBusinessPlanLink={footerProps?.showBusinessPlanLink}
        copyrightText={footerProps?.copyrightText}
      />
    </div>
  );
};

export default Layout;