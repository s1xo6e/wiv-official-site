const navItems = [
  ["首页", "#home"],
  ["产品与解决方案", "#solutions"],
  ["案例", "#cases"],
  ["关于我们", "#about"],
  ["联系我们", "#contact"],
];

const stats = [
  ["3", "产品系列"],
  ["14+", "模块化方案"],
  ["8", "应用方向"],
  ["11", "代表案例素材"],
];

const series = [
  {
    title: "X-IL 多域在环系列",
    label: "仿真 / 在环 / 台架",
    text: "在安全、可控、可重复的环境中完成系统、控制器、算法与人的闭环验证。",
    modules: ["整车在环", "智驾在环", "底盘在环", "座舱在环", "驾驶员在环", "远程驾驶"],
  },
  {
    title: "REAL CAR 真车快速原型系列",
    label: "实车开发 / 道路验证",
    text: "面向道路实车的模块化研发、部署、标定与验证平台，连接算法、线控车辆与工程化验证。",
    modules: ["车路云", "自驾", "虚拟测试", "数采", "能量管理", "智能底盘"],
  },
  {
    title: "SRIF 飞行器系列",
    label: "低空智能运载",
    text: "面向智能低空飞行器，覆盖虚实融合在环验证与飞行器快速原型研发。",
    modules: ["SRIF 在环", "飞行器快速原型"],
  },
];

const products = [
  {
    name: "整车在环模块",
    series: "X-IL",
    image: "/assets/products/xil/IMG-XIL-整车在环模块.png",
    text: "面向整车动力、三电、智驾与网联场景的整车级闭环验证。",
    tags: ["整车级验证", "动力学仿真", "环境模拟"],
  },
  {
    name: "智驾在环模块",
    series: "X-IL",
    image: "/assets/products/xil/IMG-XIL-智驾在环模块.JPG",
    text: "服务自动驾驶域控制器、算法及控制系统的闭环测试。",
    tags: ["自动驾驶", "场景仿真", "控制系统"],
  },
  {
    name: "车路云模块",
    series: "REAL CAR",
    image: "/assets/products/real-car/IMG-RC-车路云模块.png",
    text: "支撑车路云网联智驾研发验证，覆盖车辆、通信、感知、云控与协同系统。",
    tags: ["车路云", "网联智驾", "示范应用"],
  },
  {
    name: "智能底盘模块",
    series: "REAL CAR",
    image: "/assets/products/real-car/IMG-RC-智能底盘模块.png",
    text: "用于极限动态控制与底盘软硬件实车验证，连接线控底盘与跨域控制。",
    tags: ["智能底盘", "线控车辆", "跨域控制"],
  },
  {
    name: "数据采集模块",
    series: "REAL CAR",
    image: "/assets/products/real-car/IMG-RC-数据采集模块.png",
    text: "面向多模态数据采集、高精地图、环境建模和边缘计算工具链。",
    tags: ["数采", "高精地图", "数字孪生"],
  },
  {
    name: "SRIF 飞行器在环模块",
    series: "SRIF",
    image: "/assets/products/srif/IMG-SRIF-飞行器在环模块.jpg",
    text: "用于智能飞行器虚实融合研发与验证，支持飞控仿真、HIL 与自主飞行测试。",
    tags: ["低空智能", "飞控仿真", "虚实融合"],
  },
];

const cases = [
  {
    title: "智能底盘实验室",
    type: "技术研发 / 实验室",
    image: "/assets/cases/CASE-001-智能底盘实验室.png",
    text: "围绕智能底盘、EMB、HIL 与跨域控制构建研发测试能力。",
  },
  {
    title: "车路云实验室",
    type: "示范应用",
    image: "/assets/cases/CASE-005-车路云实验室.png.png",
    text: "面向车路云协同、自动泊车与网联智驾验证的综合实验环境。",
  },
  {
    title: "低空飞行实验中心",
    type: "实验室建设",
    image: "/assets/cases/CASE-008-低空飞行实验中心.png",
    text: "支持 SRIF 在环验证、飞行器快速原型与自主飞行测试场建设。",
  },
  {
    title: "整车在环实验室",
    type: "实验室建设",
    image: "/assets/cases/CASE-011-整车在环实验室.png",
    text: "以虚实融合方式完成整车、智驾、三电与网联场景验证。",
  },
];

const capabilities = ["多领域", "全链路", "可组合扩展", "科研教学兼顾"];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="西部智车首页">
          <img src="/assets/logo/full-color.png" alt="西部智车" />
        </a>
        <nav aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          获取方案
        </a>
      </header>

      <section className="hero" id="home">
        <img className="hero-image" src="/assets/home/hero.jpg" alt="西部智车智能运载研发测试场景" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">wivSPACE 智车空间</p>
          <h1>让智能运载研发与测试，更快走向真实世界</h1>
          <p className="hero-copy">
            覆盖仿真、在环、台架与道路实车，提供可组合、可扩展的研发测试平台与实验室解决方案。
          </p>
          <div className="hero-actions">
            <a className="primary" href="#solutions">
              探索产品
            </a>
            <a className="secondary" href="#contact">
              联系我们
            </a>
          </div>
        </div>
        <div className="stat-strip" aria-label="网站核心数据">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section intro" id="overview">
        <div>
          <p className="eyebrow">公司速览</p>
          <h2>智能运载研发与测试解决方案提供商</h2>
        </div>
        <p>
          西部智车面向汽车企业、研发机构、高校院所与产业平台，连接智能网联软硬件、智能底盘系统控制与工程化验证，
          提供从设计、改造、集成、调试、标定到测试的完整能力链。
        </p>
      </section>

      <section className="section" id="solutions">
        <div className="section-heading">
          <p className="eyebrow">产品与解决方案</p>
          <h2>wivSPACE 模块化研发测试体系</h2>
          <p>
            以 X-IL、REAL CAR、SRIF 三大系列组织产品能力，按应用方向与研发阶段灵活组合。
          </p>
        </div>
        <div className="architecture">
          <img src="/assets/products/architecture.png" alt="西部智车业务架构图" />
        </div>
        <div className="series-grid">
          {series.map((item) => (
            <article className="series-card" key={item.title}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="module-list">
                {item.modules.map((module) => (
                  <em key={module}>{module}</em>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section product-band">
        <div className="section-heading">
          <p className="eyebrow">代表产品</p>
          <h2>从实验室到真实道路的关键模块</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <img src={product.image} alt={product.name} />
              <div>
                <span>{product.series}</span>
                <h3>{product.name}</h3>
                <p>{product.text}</p>
                <div className="tag-row">
                  {product.tags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section capability">
        <div>
          <p className="eyebrow">核心能力</p>
          <h2>以工程化方式承接复杂研发测试需求</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map((item, index) => (
            <div key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
              <p>
                {index === 0 && "覆盖智能驾驶、智能底盘、车路云协同、能量管理、智能座舱与低空智能运载。"}
                {index === 1 && "贯穿虚拟仿真、在环验证、台架测试、实车开发与道路验证。"}
                {index === 2 && "按客户研发阶段、实验室条件与交付目标进行模块化组合。"}
                {index === 3 && "兼顾企业研发验证、高校科研教学、实训展示与成果转化。"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="cases">
        <div className="section-heading">
          <p className="eyebrow">代表案例</p>
          <h2>真实项目验证产品能力</h2>
          <p>首版优先展示已整理素材的实验室建设、示范应用、技术研发与教学实训项目。</p>
        </div>
        <div className="case-grid">
          {cases.map((item) => (
            <article className="case-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section about" id="about">
        <div className="about-copy">
          <p className="eyebrow">关于我们</p>
          <h2>连接科研积累、产业场景与工程交付</h2>
          <p>
            西部智车（重庆）科技有限公司聚焦智能汽车实车研发平台、智能底盘关键技术和研发测试系统，
            将实验室能力、车辆平台、数据工具链与工程实施经验转化为可落地的产品与解决方案。
          </p>
          <ul>
            <li>智能网联软硬件与智能底盘系统控制</li>
            <li>设计、改造、集成、调试、标定、测试与工程化</li>
            <li>EMB、底盘域控制器、特色算法、数字孪生与测试系统</li>
          </ul>
        </div>
        <div className="about-media">
          <img src="/assets/about/IMG-ABOUT-公司.jpg" alt="西部智车公司环境" />
          <img src="/assets/about/IMG-ABOUT-团队.JPG" alt="西部智车团队" />
        </div>
      </section>

      <section className="section contact" id="contact">
        <div>
          <p className="eyebrow">联系我们</p>
          <h2>告诉我们您的研发、测试或实验室建设需求</h2>
          <p>公司地址：重庆市高新区含谷镇科翔路 4 号 3 幢</p>
          <p>商务电话与邮箱可在上线前替换为公司确认后的统一口径。</p>
          <img className="qr" src="/assets/contact/IMG-CONTACT-公众号.png" alt="西部智车微信公众号二维码" />
        </div>
        <form className="contact-form">
          <label>
            姓名
            <input name="name" placeholder="请输入联系人姓名" />
          </label>
          <label>
            单位
            <input name="company" placeholder="公司 / 学校 / 机构" />
          </label>
          <label>
            手机或邮箱
            <input name="contact" placeholder="便于我们联系您" />
          </label>
          <label>
            需求方向
            <select name="interest" defaultValue="">
              <option value="" disabled>
                请选择
              </option>
              <option>产品咨询</option>
              <option>实验室建设</option>
              <option>科研合作</option>
              <option>教学实训</option>
              <option>其他</option>
            </select>
          </label>
          <label className="full">
            项目需求
            <textarea name="message" placeholder="请简述目标、现状与时间计划" />
          </label>
          <button type="button">提交需求</button>
          <small>提交前请确认联系方式准确；正式上线时可接入邮件、CRM 或表单服务。</small>
        </form>
      </section>

      <footer>
        <img src="/assets/logo/full-white.png" alt="西部智车" />
        <p>不断为汽车赋予智慧、活力与乐趣。</p>
        <div>
          {navItems.slice(1).map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <span>Copyright © 2026 西部智车（重庆）科技有限公司</span>
      </footer>
    </main>
  );
}
