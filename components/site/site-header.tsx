"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { caseStudies, productHref, productLines } from "@/content/site-content";
import { navigation } from "@/content/navigation";
import { ArrowRight } from "@/components/site/arrow-right";

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const toggleRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hoverTimers = useRef<{ open?: ReturnType<typeof setTimeout>; close?: ReturnType<typeof setTimeout> }>({});

  function clearHoverTimers() {
    clearTimeout(hoverTimers.current.open);
    clearTimeout(hoverTimers.current.close);
    hoverTimers.current = {};
  }

  function openNavigation(id: string | null) {
    clearHoverTimers();
    setOpenMenu(id);
  }

  function closeNavigation() {
    clearHoverTimers();
    setOpenMenu(null);
    setMobileOpen(false);
  }

  function scheduleOpen(id: string) {
    clearHoverTimers();
    hoverTimers.current.open = setTimeout(() => setOpenMenu(id), 75);
  }

  function scheduleClose() {
    clearHoverTimers();
    hoverTimers.current.close = setTimeout(() => setOpenMenu(null), 140);
  }

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        clearTimeout(hoverTimers.current.open);
        clearTimeout(hoverTimers.current.close);
        hoverTimers.current = {};
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      clearTimeout(hoverTimers.current.open);
      clearTimeout(hoverTimers.current.close);
    };
  }, []);

  useEffect(() => {
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      clearTimeout(hoverTimers.current.open);
      clearTimeout(hoverTimers.current.close);
      hoverTimers.current = {};
      if (openMenu) {
        event.preventDefault();
        if (headerRef.current?.contains(document.activeElement)) toggleRefs.current[openMenu]?.focus();
        setOpenMenu(null);
      } else if (mobileOpen) {
        event.preventDefault();
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [openMenu, mobileOpen]);

  return (
    <header className="site-header" ref={headerRef} onBlur={event => {
      if ((event.target as HTMLElement).closest(".nav-panel[inert]")) return;
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeNavigation();
    }}>
      <div className="menu-backdrop" data-open={openMenu !== null} aria-hidden="true" />
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="西部智车首页" onClick={closeNavigation}>
          <img src="/assets/logo/full-color.png" alt="西部智车" width="1800" height="239" />
        </Link>
        <button className="mobile-toggle" type="button" ref={mobileButtonRef}
          aria-expanded={mobileOpen} aria-controls="primary-navigation"
          onClick={() => { clearHoverTimers(); setMobileOpen(!mobileOpen); setOpenMenu(null); }}>
          <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
          {mobileOpen ? "关闭" : "菜单"}
        </button>
        <nav id="primary-navigation" className={mobileOpen ? "primary-nav is-open" : "primary-nav"} aria-label="主导航">
          <ul className="nav-list">
            {navigation.map(item => {
              const hasSubmenu = Boolean(item.submenu);
              const expanded = hasSubmenu && openMenu === item.id;
              return (
                <li className={`nav-item nav-item-${item.id}${expanded ? " is-expanded" : ""}`} key={item.id}
                  onPointerEnter={event => {
                    if (event.pointerType === "mouse" && window.matchMedia("(min-width: 981px) and (hover: hover)").matches) {
                      if (hasSubmenu) scheduleOpen(item.id);
                      else openNavigation(null);
                    }
                  }}
                  onPointerLeave={event => {
                    if (hasSubmenu && event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) scheduleClose();
                  }}
                  onBlur={event => {
                    // Inert can blur a previously focused panel while another opens.
                    if ((event.target as HTMLElement).closest(".nav-panel[inert]")) return;
                    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) openNavigation(null);
                  }}>
                  <div className="nav-topline">
                    <a className="nav-label" href={item.href} aria-current={(pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))) ? "page" : undefined}
                      onFocus={() => openNavigation(hasSubmenu ? item.id : null)} onClick={closeNavigation}>{item.label}</a>
                    {hasSubmenu && <button className="submenu-toggle" type="button" ref={element => { toggleRefs.current[item.id] = element; }}
                      aria-label={`${expanded ? "收起" : "展开"}${item.label}子导航`}
                      aria-expanded={expanded} aria-controls={`submenu-${item.id}`}
                      onClick={() => openNavigation(expanded ? null : item.id)}>
                      <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="m4.5 6.25 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>}
                  </div>
                  {hasSubmenu && <div id={`submenu-${item.id}`} className={`nav-panel nav-panel-wide${item.id === "solutions" ? " nav-panel-products" : " nav-panel-cases"}`}
                    aria-hidden={!expanded} inert={!expanded}>
                    <div className="nav-panel-clip"><div className="nav-panel-inner">
                      {item.id === "solutions" ? (
                        <>
                          <div className="nav-product-columns">
                            {productLines.map((line, index) => (
                              <div className="nav-product-group" key={line.id}>
                                <a className="nav-series" href={`/solutions#${line.id}`} onClick={closeNavigation}>
                                  <strong>{line.shortName}</strong><span>{line.title}</span>
                                </a>
                                <ul className="nav-module-list">{line.modules.map(module => <li key={module.id}><a href={productHref(line.id, module)} onClick={closeNavigation}>{module.name}</a></li>)}</ul>
                                {index === 0 && <Link className="nav-all-products" href="/solutions" onClick={closeNavigation}>查看全部产品与解决方案</Link>}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="nav-product-columns">
                            {productLines.map((line, index) => (
                              <div className="nav-case-group" key={line.id}>
                                <a className="nav-series" href={`/cases#${line.id}`} onClick={closeNavigation}><strong>{line.shortName}</strong><span>{line.title}</span></a>
                                <ul className="nav-case-list">{caseStudies.filter(caseStudy => caseStudy.productLineIds.includes(line.id)).map(caseStudy => <li key={caseStudy.id}><a href={`/cases#${line.id}-${caseStudy.id}`} onClick={closeNavigation}>{caseStudy.name}</a></li>)}</ul>
                                {index === 0 && <a href="/cases" className="nav-all-products" onClick={closeNavigation}>查看全部案例</a>}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div></div>
                  </div>}
                </li>
              );
            })}
          </ul>
          <a className="mobile-contact text-link" href="/contact" onClick={closeNavigation}>获取方案 <ArrowRight /></a>
        </nav>
        <a className="header-cta" href="/contact">获取方案 <ArrowRight /></a>
      </div>
    </header>
  );
}
