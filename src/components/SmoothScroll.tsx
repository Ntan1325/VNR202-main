import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');

      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    let scrollTimeout: number;

    const smoothScroll = () => {
      document.documentElement.style.scrollBehavior = 'smooth';

      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
      }, 1000);
    };

    window.addEventListener('wheel', smoothScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', smoothScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
}
