import { ArrowRight } from "@/components/site/arrow-right";
import type { Metadata } from "next";
import { ContactBand, PageIntro } from "@/components/site/page-parts";
import { productHref, productLines } from "@/content/site-content";

export const metadata: Metadata = {
  title: "产品与解决方案 | 西部智车",
  description: "了解 wivSPACE X-IL、REAL CAR 与 SRIF 三条独立产品线，按研发对象与测试场景选择在环验证、真车快速原型和飞行器研发模块。",
};

export default function SolutionsPage() {
  return (
    <>
      <PageIntro
        eyebrow="产品与解决方案"
        title="三条产品线，连接研发与验证"
        description="面向高校科研、教学实训与实验室建设，从研发对象和测试目标出发，选择适配的产品模块。"
      />

      <nav className="container product-map" aria-label="产品系列快捷入口">
        {productLines.map((line, index) => (
          <a href={`#${line.id}`} key={line.id}>
            <span className="product-map-number">0{index + 1}</span>
            <span className="product-map-copy"><strong>{line.shortName}</strong><span>{line.title}</span><small>{line.label}</small></span>
            <span className="product-map-down" aria-hidden="true">↓</span>
          </a>
        ))}
      </nav>

      {productLines.map((line, lineIndex) => (
        <section className={`section series-section product-series product-series--${line.id}`} id={line.id} key={line.id} aria-labelledby={`${line.id}-heading`}>
          <div className="container">
            <div className="series-heading">
              <div>
                <p className="eyebrow">0{lineIndex + 1} / {line.label}</p>
                <h2 id={`${line.id}-heading`}><span>{line.shortName}</span><span className="product-series-title">{line.title}</span></h2>
              </div>
              <p>{line.description}</p>
            </div>

            <div className={`module-grid product-grid product-grid--${line.id}`}>
              {line.modules.map((module, moduleIndex) => (
                <article className={`module-card product-card${!module.image ? " product-card--text" : ""}`} id={module.id} key={module.id}>
                  {module.image && (
                    <a className="module-image" href={productHref(line.id, module)} tabIndex={-1} aria-hidden="true">
                      <img
                        src={module.image}
                        alt={`${module.name}产品展示`}
                        width={module.imageWidth}
                        height={module.imageHeight}
                        loading="lazy"
                      />
                    </a>
                  )}
                  <div className="module-copy">
                    <span className="module-index">{line.shortName} / {String(moduleIndex + 1).padStart(2, "0")}</span>
                    <h3><a href={productHref(line.id, module)}>{module.name}</a></h3>
                    <p>{module.description}</p>
                    <a className="text-link" href={module.detailSlug ? productHref(line.id, module) : "/contact#brief"}>
                      {module.detailSlug ? "了解产品详情" : "沟通应用需求"} <ArrowRight />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <a className="text-link" href={`/cases#${line.id}`}>查看相关案例 <ArrowRight /></a>
          </div>
        </section>
      ))}

      <ContactBand />
    </>
  );
}
