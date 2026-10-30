import Link from "next/link";
import { ArrowRight } from "@/components/site/arrow-right";
import type { Metadata } from "next";
import { productHref, productLines } from "@/content/site-content";
import { ContactBand } from "@/components/site/page-parts";
import { LegacyHomeLinks } from "@/components/site/legacy-home-links";

export const metadata: Metadata = {
  title: "西部智车 | 智能运载研发与测试解决方案",
  description: "面向高校、科研院所与汽车研发，了解西部智车wivSPACE三大产品系列、研发测试方案与实验室建设方向。",
};

export default function Home() {
  return <>
    <LegacyHomeLinks />
    <section className="hero" id="home">
      <img className="hero-image" src="/assets/home/hero.jpg" alt="西部智车公司与车辆研发场景" width="1800" height="1150" fetchPriority="high" />
      <div className="hero-overlay" />
      <div className="container hero-content"><p className="eyebrow">wivSPACE 智车空间</p>
        <h1>让智能运载研发与测试，<br className="desktop-break" />更快走向真实世界</h1>
        <p className="hero-copy">面向高校与科研院所，连接仿真、在环、台架与实车验证，提供模块化研发测试平台与实验室解决方案。</p>
        <div className="hero-actions"><Link className="primary" href="/solutions">探索产品 <ArrowRight /></Link><a className="secondary" href="/contact">获取方案 <ArrowRight /></a></div>
        <div className="hero-caption"><span />科研验证 / 实验室建设 / 教学实训</div>
      </div>
    </section>
    <section className="section" id="overview"><div className="container intro-grid">
      <div><p className="eyebrow">关于西部智车</p><h2>连接科研问题<br />与工程实践</h2><a className="text-link" href="/about">了解我们 <ArrowRight /></a></div>
      <div className="intro-copy"><p>西部智车（重庆）科技有限公司聚焦智能汽车、智能底盘与低空智能运载领域，将车辆平台、测试系统与工程实施相连接。</p><p>围绕科研课题、实验室建设和教学实训，按研究对象与研发阶段组合产品模块，让研究与验证有清晰的实施路径。</p></div>
    </div></section>
    <section className="section paper" id="product-lines"><div className="container">
      <div className="section-heading heading-row"><div><p className="eyebrow">产品与解决方案</p><h2>三条产品线，各有专注</h2><p>从可控环境中的闭环验证，到真实载具上的快速原型。</p></div><Link className="text-link" href="/solutions">全部产品 <ArrowRight /></Link></div>
      <div className="series-grid">{productLines.map((line, index) => <article className="series-card" key={line.id}>
        <div className="series-card-top"><span className="series-number">0{index + 1}</span><span>{line.label}</span></div>
        <p className="series-wordmark">{line.shortName}</p><h3>{line.title}</h3><p>{line.description}</p>
        <div className="module-list">{line.modules.map(module => <a key={module.id} href={productHref(line.id, module)}>{module.name}</a>)}</div>
        <a className="text-link" href={`/solutions#${line.id}`}>查看系列 <ArrowRight /></a>
      </article>)}</div>
    </div></section>
    <section className="section" id="featured-cases"><div className="container case-entry">
      <div><p className="eyebrow">案例与应用</p><h2>从产品出发，<br />走进应用场景</h2><p>按三条产品线，了解实验室与研发平台的建设方向。</p><a className="text-link" href="/cases">进入案例中心 <ArrowRight /></a></div>
      <div className="case-entry-links">{productLines.map((line, index) => <a key={line.id} href={`/cases#${line.id}`}><span>0{index + 1}</span><div><strong>{line.shortName}</strong><p>{line.title}</p></div><span aria-hidden="true"><ArrowRight /></span></a>)}</div>
    </div></section>
    <ContactBand />
    <noscript><div className="container legacy-links"><p>章节入口</p><Link id="solutions" href="/solutions">产品与解决方案</Link><a id="cases" href="/cases">案例</a><a id="about" href="/about">关于我们</a><a id="contact" href="/contact">联系我们</a></div></noscript>
  </>;
}
