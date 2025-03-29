import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import ImageCard from "@/components/image-card";
import '../globals.css'

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <Link href="/about">{t('about')}</Link>
      <h1>{t('title')}</h1>
      <div className='container m-auto grid grid-cols-3 gap-4'>
        <ImageCard fileName={"/images/1.jpeg"}/>
        <ImageCard fileName={"/images/1.jpeg"}/>
        <ImageCard fileName={"/images/1.jpeg"}/>
        <ImageCard fileName={"/images/1.jpeg"}/>
        <ImageCard fileName={"/images/1.jpeg"}/>
        <ImageCard fileName={"/images/1.jpeg"}/>
      </div>
    </div>
  );
}