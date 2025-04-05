import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import './globals.css';

export default async function RootLayout({
                                           children,
                                           params
                                         }: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const locale = (await params).locale;

  // Check if locale is in our supported locales
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // At this point, we know locale is valid
  const validLocale = locale as (typeof routing.locales)[number];

  // Load the translations for the current locale
  const messages = (await import(`../../public/locales/${validLocale}.json`)).default;

  return (
    <html lang={validLocale}>
    <body className="bg-white text-gray-900 min-h-screen">
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
    </body>
    </html>
  );
}