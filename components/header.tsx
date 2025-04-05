import { FC } from 'react';
import { Link } from '@/i18n/navigation';

const Header: FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              THIRTEENK
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm hover:text-blue-600">
              Home
            </Link>
            <Link href="/gallery" className="text-sm hover:text-blue-600">
              Gallery
            </Link>
            <Link href="/about" className="text-sm hover:text-blue-600">
              About
            </Link>
          </nav>

          <div className="flex items-center">
            <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
              <span className="mr-2 text-sm">Total Downloads</span>
              <span className="font-bold">13,000</span>
            </div>

            <div className="ml-4">
              <Link href="/" locale="en" className="mx-1 text-sm hover:text-blue-600">
                EN
              </Link>
              <span className="mx-1 text-gray-300">|</span>
              <Link href="/" locale="zu" className="mx-1 text-sm hover:text-blue-600">
                ZU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;