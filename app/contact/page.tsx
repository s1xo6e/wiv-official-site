import Link from "next/link";
import { ArrowRight } from "@/components/site/arrow-right";
import type { Metadata } from "next";
import { PageIntro } from "@/components/site/page-parts";

export const metadata: Metadata = { title: "联系我们 | 西部智车", description: "围绕科研验证、产品咨询、实验室建设与教学实训，梳理与西部智车沟通需求时的研究对象、实验条件和项目计划。" };

export default function Contact() {
  return <>
    <PageIntro eyebrow="联系我们" title="一起讨论研发需求" description="产品咨询、实验室建设、科研合作或教学实训，让我们从您的目标与现有条件出发。" />
    <section className="section" id="channels"><div className="container contact-layout">
      <div><p className="eyebrow">联系渠道</p><h2>西部智车</h2><p className="company-full-name">西部智车（重庆）科技有限公司</p><p>面向高校、科研院所与汽车研发团队，围绕具体研究对象与应用场景，梳理产品模块和建设方向。</p><div className="contact-topics"><span>产品咨询</span><span>实验室建设</span><span>科研合作</span><span>教学实训</span></div></div>
      <aside className="contact-reserved" aria-label="联系渠道预留区域"><p className="eyebrow">一起连接下一步</p><h3>让需求找到合适的沟通入口</h3><p>联系信息正在整理中。您可以先参考下方清单，梳理项目目标与实验条件。</p><a className="text-link" href="#brief">查看沟通准备 <span aria-hidden="true">↓</span></a></aside>
    </div></section>
    <section className="section paper" id="brief"><div className="container"><div className="section-heading"><p className="eyebrow">需求沟通准备</p><h2>带着这些信息，开始讨论</h2><p>先描述需要解决的问题，再一起确定适合的产品与方案。</p></div>
      <div className="brief-grid">{[
        ["研究与测试对象", "车辆、控制器、算法、驾驶员，或低空飞行器。"],
        ["希望解决的问题", "课题验证、功能测试、实验室建设，或课程实训。"],
        ["现有实验条件", "已有车辆与设备、场地条件、系统接口及工具链。"],
        ["项目计划", "当前所处阶段、预期时间安排，以及希望讨论的交付范围。"],
      ].map(([title, text], index) => <article key={title}><span className="module-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      <Link className="text-link" href="/solutions">先了解三大产品系列 <ArrowRight /></Link>
    </div></section>
  </>;
}
