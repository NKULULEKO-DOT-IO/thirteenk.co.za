import { FC } from 'react';
import { Link } from '@/i18n/navigation';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">THIRTEENK</h2>
            <p className="text-sm text-gray-600">
              A cultural digital content platform focusing on South African imagery.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase mb-4 text-gray-500">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Home</Link></li>
              <li><Link href="/gallery" className="text-sm text-gray-600 hover:text-blue-600">Gallery</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase mb-4 text-gray-500">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase mb-4 text-gray-500">Contact</h3>
            <ul className="space-y-2">
              <li><a href="mailto:info@thirteenk.co.za" className="text-sm text-gray-600 hover:text-blue-600">info@thirteenk.co.za</a></li>
              <li><a href="https://github.com/nkululeko-dot-io" className="text-sm text-gray-600 hover:text-blue-600">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Thirteenk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;