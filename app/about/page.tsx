import Link from "next/link";
import { ArrowRight } from "@/components/site/arrow-right";
import type { Metadata } from "next";
import { ContactBand, PageIntro } from "@/components/site/page-parts";

export const metadata: Metadata = { title: "关于我们 | 西部智车", description: "了解西部智车的公司定位、研发与工程方向，以及科研合作、成果转化、联合培养和赛事支持。" };

export default function About() {
  return <>
    <PageIntro eyebrow="关于我们" title="连接科研积累与工程实践" description="围绕智能汽车、智能底盘与低空智能运载，连接研发测试平台、工程实施与科研教学。" />
    <section className="section" id="company"><div className="container about-company">
      <div><p className="eyebrow">公司介绍</p><h2>西部智车</h2><p className="company-full-name">西部智车（重庆）科技有限公司</p><p>公司聚焦智能汽车实车研发平台、智能底盘关键技术与研发测试系统，为科研验证、实验室建设及教学实训提供模块化产品与系统解决方案。</p><p>以 wivSPACE 为产品品牌，形成 X-IL 多域在环、REAL CAR 真车快速原型与 SRIF 飞行器三条独立产品线。</p><Link className="text-link" href="/solutions">认识 wivSPACE <ArrowRight /></Link></div>
      <img src="/assets/about/IMG-ABOUT-公司.jpg" alt="西部智车公司环境" width="1800" height="1001" loading="lazy" />
    </div></section>
    <section className="section paper" id="engineering"><div className="container"><div className="section-heading"><p className="eyebrow">研发与工程</p><h2>围绕研发阶段，组织验证能力</h2></div>
      <div className="capability-grid">{[
        ["虚实融合", "连接模型、真实控制器与载具，在可控环境中开展闭环测试。"],
        ["模块化组合", "按研究对象、实验条件与接口需求，组合在环与实车平台。"],
        ["工程实施", "贯穿设计、改造、集成、调试、标定与测试。"],
        ["科研与教学", "兼顾课题验证、实验室建设、课程实训与联合培养。"],
      ].map(([title, text], index) => <article key={title}><span className="module-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </div></section>
    <section className="section" id="cooperation"><div className="container cooperation-grid">
      <img src="/assets/about/IMG-ABOUT-团队.JPG" alt="西部智车团队交流场景" width="1800" height="1012" loading="lazy" />
      <div><p className="eyebrow">科研与生态合作</p><h2>连接平台、人才与技术</h2><p>围绕科研合作、成果转化、联合培养与赛事支持，探索平台与工程能力的协同应用。</p><div className="tag-row"><span>科研合作</span><span>成果转化</span><span>联合培养</span><span>赛事支持</span></div><a className="text-link" href="/contact#brief">沟通合作需求 <ArrowRight /></a></div>
    </div></section><ContactBand />
  </>;
}
