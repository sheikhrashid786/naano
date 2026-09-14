'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface LiveLandingPageProps {
  html: string;
}

export default function LiveLandingPage({ html }: LiveLandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // 1. Navbar Scroll Transition
    const navPill = root.querySelector('#naano-nav-pill') as HTMLElement | null;
    function handleScroll() {
      if (!navPill) return;
      if (window.scrollY > 40) {
        navPill.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
        navPill.style.backdropFilter = 'blur(16px)';
        navPill.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
        navPill.style.borderBottom = '1px solid #EAE8E4';
      } else {
        navPill.style.backgroundColor = 'transparent';
        navPill.style.backdropFilter = 'none';
        navPill.style.boxShadow = 'none';
        navPill.style.borderBottom = 'none';
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Resources Dropdown Toggle
    const resourcesTrigger = root.querySelector('.lp-nav-group-trigger') as HTMLElement | null;
    let resourcesDropdown: HTMLElement | null = null;
    if (resourcesTrigger) {
      const parent = resourcesTrigger.parentElement;
      if (parent) {
        resourcesDropdown = document.createElement('div');
        resourcesDropdown.style.cssText =
          'position:absolute;top:calc(100% + 8px);left:0;min-width:220px;background:#FFFFFF;border:1px solid #EAE8E4;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.08);padding:8px;display:none;z-index:60;';
        resourcesDropdown.innerHTML = `
          <a href="/case-studies/blogseo" style="display:block;padding:10px 14px;font-size:14px;color:#17181C;text-decoration:none;border-radius:8px;font-weight:500;">Case Study: BlogSEO</a>
          <a href="/blog" style="display:block;padding:10px 14px;font-size:14px;color:#17181C;text-decoration:none;border-radius:8px;font-weight:500;">Blog</a>
          <a href="/#faq" style="display:block;padding:10px 14px;font-size:14px;color:#17181C;text-decoration:none;border-radius:8px;font-weight:500;">FAQs</a>
          <a href="/login" style="display:block;padding:10px 14px;font-size:14px;color:#17181C;text-decoration:none;border-radius:8px;font-weight:500;">Platform Login</a>
        `;
        parent.appendChild(resourcesDropdown);

        resourcesTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          if (resourcesDropdown) {
            const isVisible = resourcesDropdown.style.display === 'block';
            resourcesDropdown.style.display = isVisible ? 'none' : 'block';
          }
        });
      }
    }

    // 3. Mobile Burger Menu Toggle
    const burgerBtn = root.querySelector('.lp-nav-burger') as HTMLElement | null;
    const navMenu = root.querySelector('.lp-nav-menu') as HTMLElement | null;
    if (burgerBtn && navMenu) {
      burgerBtn.addEventListener('click', () => {
        const isOpen = navMenu.style.display === 'block';
        navMenu.style.display = isOpen ? 'none' : 'block';
      });
    }

    // 4. FAQ Accordion Handler
    const faqButtons = root.querySelectorAll('button');
    faqButtons.forEach((btn) => {
      const parent = btn.parentElement;
      const siblingP = parent?.querySelector('p');
      if (siblingP && btn.textContent?.includes('?')) {
        btn.addEventListener('click', () => {
          const isHidden = siblingP.style.display === 'none';
          siblingP.style.display = isHidden ? 'block' : 'none';
          const icon = btn.querySelector('svg');
          if (icon) {
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            icon.style.transition = 'transform 0.2s ease';
          }
        });
      }
    });

    // 5. Close dropdowns on outside click
    function handleDocClick() {
      if (resourcesDropdown) {
        resourcesDropdown.style.display = 'none';
      }
    }
    document.addEventListener('click', handleDocClick);

    // 6. Seamless SPA Client-Side Transitions (prevents full page reload)
    function handleLinkClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.getAttribute('target') === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      if (href.startsWith('#')) {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      if (href.startsWith('/')) {
        e.preventDefault();
        router.push(href);
      }
    }

    root.addEventListener('click', handleLinkClick);

    // Prefetch key landing routes for instant transitions
    router.prefetch('/');
    router.prefetch('/creators');
    router.prefetch('/agencies');
    router.prefetch('/blog');
    router.prefetch('/case-studies/blogseo');
    router.prefetch('/login');
    router.prefetch('/register');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleDocClick);
      root.removeEventListener('click', handleLinkClick);
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
