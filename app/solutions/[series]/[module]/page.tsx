import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/site/arrow-right";
import { getProductDetail } from "@/content/product-details";
import { productHref, productLines } from "@/content/site-content";

type Props = { params: Promise<{ series: string; module: string }> };

async function resolveProduct(params: Props["params"]) {
  const { series, module: slug } = await params;
  const line = productLines.find(item => item.id === series);
  const product = line?.modules.find(item => item.detailSlug === slug);
  const detail = getProductDetail(series, slug);
  if (!line || !product || !detail || detail.moduleId !== product.id) notFound();
  return { line, module: product, detail };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { line, module: product } = await resolveProduct(params);
  return {
    title: `${product.name} | ${line.shortName} | 西部智车`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { line, module: product, detail } = await resolveProduct(params);
  const isRealCar = line.id === "real-car";
  const related = line.modules.filter(item => item.id !== product.id && item.detailSlug);

  return (
    <div className={`product-detail product-detail--${line.id}`}>
      <section className="product-hero" id="overview">
        <div className="container">
          <nav className="product-breadcrumb" aria-label="面包屑">
            <Link href="/">首页</Link><span aria-hidden="true">/</span>
            <Link href="/solutions">产品与解决方案</Link><span aria-hidden="true">/</span>
            <a href={`/solutions#${line.id}`}>{line.shortName}</a><span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <div className="product-hero-grid">
            <div className="product-hero-copy">
              <p className="eyebrow">wivSPACE {line.shortName} / {line.title}</p>
              <h1>{product.name}</h1>
              <p className="product-focus">{detail.focus}</p>
              <p className="product-lead">{detail.intro}</p>
              <div className="product-actions">
                <a className="primary" href="/contact#brief">沟通研究需求 <ArrowRight /></a>
                <a className="text-link" href="#composition">了解系统组成 <span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <figure className="product-hero-media">
              <img src={product.image} alt={`${product.name}产品展示`} width={product.imageWidth} height={product.imageHeight} fetchPriority="high" />
              <figcaption>{line.shortName}<span>{product.name}</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <nav className="product-local-nav" aria-label="产品详情章节">
        <div className="container">
          <a href="#overview">产品概览</a><a href="#composition">系统组成</a>
          <a href="#research">研发与测试</a><a href="#applications">应用方向</a>
        </div>
      </nav>

      <section className="section product-composition" id="composition" aria-labelledby="composition-heading">
        <div className="container product-section-layout">
          <div className="product-section-intro">
            <p className="eyebrow">01 / 系统组成</p>
            <h2 id="composition-heading">系统组成</h2>
            <p>{product.id === "real-car-virtual" ? "以测试台架为基础，连接实时仿真、场景输入与自动化测试工具。" : isRealCar ? "以真实车辆为研发载体，连接感知、控制与部署工具。" : "连接仿真、测试对象与实验设备，构建可控的验证环境。"}</p>
          </div>
          <ol className="product-composition-list">
            {detail.composition.map((item, index) => (
              <li key={item.name}><span className="product-item-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{item.name}</h3><p>{item.description}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section product-research" id="research" aria-labelledby="research-heading">
        <div className="container">
          <div className="product-research-heading"><div><p className="eyebrow">02 / 研发与测试</p><h2 id="research-heading">研发与测试内容</h2></div><p>围绕具体研究对象，组织功能验证、算法调试与系统联调。</p></div>
          <div className="product-test-grid">
            {detail.tests.map((item, index) => (
              <article key={item.name}><span className="product-item-number">{String(index + 1).padStart(2, "0")}</span><h3>{item.name}</h3><p>{item.description}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="applications" aria-labelledby="applications-heading">
        <div className="container product-section-layout">
          <div className="product-section-intro"><p className="eyebrow">03 / 应用方向</p><h2 id="applications-heading">应用方向</h2><p>面向高校与科研院所的课题研究、实验室建设及教学实训。</p></div>
          <div className="product-applications"><ul>{detail.applications.map(item => <li key={item}>{item}</li>)}</ul><a className="text-link" href="/contact#brief">讨论测试对象与实验条件 <ArrowRight /></a></div>
        </div>
      </section>

      <section className="section paper product-related" aria-labelledby="related-heading">
        <div className="container">
          <div className="heading-row section-heading"><div><p className="eyebrow">继续探索 {line.shortName}</p><h2 id="related-heading">同系列产品</h2></div><a className="text-link" href={`/solutions#${line.id}`}>返回系列总览 <ArrowRight /></a></div>
          <div className="product-related-links">{related.map(item => <a key={item.id} href={productHref(line.id, item)}><span>{item.name}</span><ArrowRight /></a>)}</div>
        </div>
      </section>
    </div>
  );
}
