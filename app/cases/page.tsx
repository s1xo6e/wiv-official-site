import { ArrowRight } from "@/components/site/arrow-right";
import type { Metadata } from "next";
import { ContactBand, PageIntro } from "@/components/site/page-parts";
import { caseStudies, productLines } from "@/content/site-content";

export const metadata: Metadata = {
  title: "案例 | 西部智车",
  description: "从整车在环、智能底盘和车路云实验室，到低空飞行研发教学，按 wivSPACE 三条产品线了解实验室与研发应用方向。",
};

export default function CasesPage() {
  return (
    <>
      <PageIntro
        eyebrow="案例"
        title="从研发问题，到应用场景"
        description="以实验室、实车平台与研发教学环境，呈现三条产品线在不同场景中的组合方式。"
      />

      <div className="container section-links" aria-label="案例方向快捷入口">
        {productLines.map((line) => (
          <a href={`#${line.id}`} key={line.id}>
            <span>{line.shortName}</span>
            {line.title}
            <span aria-hidden="true">↓</span>
          </a>
        ))}
      </div>

      {productLines.map((line) => (
        <section className="section series-section" id={line.id} key={line.id} aria-labelledby={`${line.id}-heading`}>
          <div className="container">
            <div className="series-heading">
              <div>
                <p className="eyebrow">{line.label}</p>
                <h2 id={`${line.id}-heading`}><span>{line.shortName}</span> 应用案例</h2>
              </div>
              <a className="text-link" href={`/solutions#${line.id}`}>了解{line.title} <ArrowRight /></a>
            </div>

            <div className="case-grid">
              {caseStudies.filter((item) => item.productLineIds.includes(line.id)).map((item) => (
                <article className="case-card" id={`${line.id}-${item.id}`} key={item.id}>
                  <div className="case-media">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={item.imageWidth}
                      height={item.imageHeight}
                      loading="lazy"
                    />
                  </div>
                  <div className="case-copy">
                    <p className="eyebrow">{item.type}</p>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="tag-row" aria-label="关联产品线">
                      {item.productLineIds.map((lineId) => (
                        <a href={`/solutions#${lineId}`} key={lineId}>
                          {productLines.find((productLine) => productLine.id === lineId)?.shortName}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <ContactBand />
    </>
  );
}
