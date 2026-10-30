import { ArrowRight } from "@/components/site/arrow-right";
import { navigation } from "@/content/navigation";
import Link from "next/link";

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-intro">
      <img
        className="page-intro-image"
        src="/assets/about/IMG-ABOUT-公司.jpg"
        alt="西部智车公司外景与研发车辆"
        width="1800"
        height="1001"
        fetchPriority="high"
      />
      <div className="page-intro-overlay" aria-hidden="true" />
      <div className="container page-intro-inner">
        <p className="breadcrumb"><Link href="/">首页</Link><span aria-hidden="true"> / </span>{eyebrow}</p>
        <div className="page-intro-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title.split("，").map((phrase, index, phrases) => (
            <span key={index}>{phrase}{index < phrases.length - 1 ? "，" : ""}</span>
          ))}</h1>
          <p className="page-intro-copy">{description}</p>
        </div>
      </div>
    </section>
  );
}

export function ContactBand() {
  return <section className="contact-band"><div className="container contact-band-inner">
    <div><p className="eyebrow">一起探索适合的研发路径</p><h2>从您的研发问题出发</h2><p>围绕测试对象、研究目标与实验条件，梳理产品模块和建设方向。</p></div>
    <a className="primary" href="/contact">联系与需求沟通 <ArrowRight /></a>
  </div></section>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div><Link href="/" aria-label="西部智车首页"><img src="/assets/logo/full-white.png" alt="西部智车" width="1800" height="239" /></Link><p>连接智能运载技术与真实应用。</p></div>
      <nav aria-label="页脚导航">{navigation.slice(1).map(item => <a key={item.id} href={item.href}>{item.label}</a>)}</nav>
    </div><p className="copyright">© 2026 西部智车（重庆）科技有限公司</p>
  </div></footer>;
}
