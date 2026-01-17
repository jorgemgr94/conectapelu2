import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  tagline?: string;
  href?: string;
  className?: string;
}

const sizes = {
  sm: { image: 32, text: 'text-base' },
  md: { image: 40, text: 'text-lg' },
  lg: { image: 48, text: 'text-xl' },
};

export function Logo({ size = 'md', showText = true, tagline, href = '/', className }: LogoProps) {
  const { image, text } = sizes[size];

  const content = (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/logo.png"
        alt="ConectaPelu2"
        width={image}
        height={image}
        className="rounded-xl"
      />
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold text-white', text)}>
            Conecta<span className="text-primary-highlight">Pelu2</span>
          </span>
          {tagline && (
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">{tagline}</span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
