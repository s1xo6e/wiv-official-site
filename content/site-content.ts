export type ProductLineId = "xil" | "real-car" | "srif";

export type ProductModule = {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  detailSlug?: string;
  sourcePage?: number;
};

export type ProductLine = {
  id: ProductLineId;
  name: string;
  shortName: string;
  title: string;
  label: string;
  description: string;
  modules: ProductModule[];
};

export type CaseStudy = {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  productLineIds: ProductLineId[];
};

// Names follow the product manual and the latest user decisions in docs/PRD.md.
// Detailed copy is kept out of the shared navigation payload.
// These existing media are for local layout review; publication approval is separate.
export const productLines: ProductLine[] = [
  {
    id: "xil",
    name: "wivSPACE X-IL 多域在环系列",
    shortName: "X-IL",
    title: "多域在环系列",
    label: "仿真 · 在环 · 台架",
    description: "将车辆、控制器、执行机构与驾驶员接入闭环环境，覆盖整车、智驾、底盘、座舱和人因研发。",
    modules: [
      {
        id: "xil-vehicle",
        name: "整车在环模块",
        description: "将真实整车接入道路负载、实时动力学与智驾场景仿真，开展动力、三电及网联智驾的整车级闭环测试。",
        image: "/assets/products/web/xil-vehicle.webp",
        imageWidth: 1400,
        imageHeight: 766,
        detailSlug: "vehicle",
        sourcePage: 5,
      },
      {
        id: "xil-driving",
        name: "智驾在环模块",
        description: "以真实智驾域控制器连接动力学和场景仿真，支持感知、决策、规划与控制算法的闭环验证。",
        image: "/assets/products/web/xil-driving.webp",
        imageWidth: 1400,
        imageHeight: 757,
        detailSlug: "driving",
        sourcePage: 6,
      },
      {
        id: "xil-chassis",
        name: "底盘在环模块",
        description: "结合底盘仿真、硬件在环和关键零部件台架，开展驱制动协同、跨域控制与故障工况测试。",
        image: "/assets/products/web/xil-chassis.webp",
        imageWidth: 1400,
        imageHeight: 788,
        detailSlug: "chassis",
        sourcePage: 7,
      },
      {
        id: "xil-cockpit",
        name: "座舱在环模块",
        description: "通过自动化测试软件与交互设备，验证触控、语音、屏幕显示、外设连接和车载信号传输。",
        image: "/assets/products/web/xil-cockpit.webp",
        imageWidth: 1400,
        imageHeight: 1050,
        detailSlug: "cockpit",
        sourcePage: 8,
      },
      {
        id: "xil-driver",
        name: "驾驶员在环模块",
        description: "将真实驾驶操作接入虚拟交通与车辆动力学环境，研究驾驶行为、人机交互和辅助驾驶体验。",
        image: "/assets/products/web/xil-driver.webp",
        imageWidth: 1400,
        imageHeight: 1050,
        detailSlug: "driver",
        sourcePage: 9,
      },
    ],
  },
  {
    id: "real-car",
    name: "wivSPACE REAL CAR 真车快速原型系列",
    shortName: "REAL CAR",
    title: "真车快速原型系列",
    label: "实车开发 · 道路验证",
    description: "以模块化线控车辆为载体，连接感知、定位、通信、计算与控制，支持算法上车、系统联调和道路验证。",
    modules: [
      {
        id: "real-car-v2x",
        name: "车路云模块",
        description: "在线控车辆上连接通信定位、感知、云控与网联智驾系统，开展车路云协同开发和联调验证。",
        image: "/assets/products/web/real-car-v2x.webp",
        imageWidth: 768,
        imageHeight: 1152,
        detailSlug: "v2x",
        sourcePage: 12,
      },
      {
        id: "real-car-driving",
        name: "智能驾驶模块",
        description: "以线控车辆、多模态感知、开源智驾算法及标定工具链，支持算法部署、传感器标定与实车验证。",
        image: "/assets/products/web/real-car-driving.webp",
        imageWidth: 768,
        imageHeight: 1152,
        detailSlug: "driving",
        sourcePage: 13,
      },
      {
        id: "real-car-virtual",
        name: "智能驾驶虚拟测试模块",
        description: "通过场景与交通流仿真、传感器模型注入和自动化测试框架，开展智能驾驶虚实融合验证。",
        image: "/assets/products/web/real-car-virtual.webp",
        imageWidth: 768,
        imageHeight: 1152,
        detailSlug: "virtual",
        sourcePage: 14,
      },
      {
        id: "real-car-data",
        name: "数据采集模块",
        description: "集成感知定位、数据通信与边缘处理，开展多模态环境数据采集、环境建模及算法研发。",
        image: "/assets/products/web/real-car-data.webp",
        imageWidth: 768,
        imageHeight: 1152,
        detailSlug: "data",
        sourcePage: 15,
      },
      {
        id: "real-car-energy",
        name: "能量管理模块",
        description: "连接整车能量分配、车路协同及虚实融合工具链，研究多工况下的能耗优化和动态控制策略。",
        image: "/assets/products/web/real-car-energy.webp",
        imageWidth: 768,
        imageHeight: 1152,
        detailSlug: "energy",
        sourcePage: 16,
      },
      {
        id: "real-car-chassis",
        name: "智能底盘模块",
        description: "将车辆状态感知、轨迹定位和多域控制接入线控实车，验证底盘动态控制及关键零部件系统。",
        image: "/assets/products/web/real-car-chassis.webp",
        imageWidth: 768,
        imageHeight: 1152,
        detailSlug: "chassis",
        sourcePage: 17,
      },
    ],
  },
  {
    id: "srif",
    name: "wivSPACE SRIF 飞行器系列",
    shortName: "SRIF",
    title: "飞行器系列",
    label: "低空智能运载",
    description: "面向低空飞行器研发，结合飞行力学、环境仿真、真实飞控与快速原型工具链，连接虚拟验证和实机测试。",
    modules: [
      {
        id: "srif-in-loop",
        name: "SRIF在环模块",
        description: "融合飞行力学模型、环境仿真与真实飞控硬件，验证飞控、感知及自主飞行任务。",
        image: "/assets/products/srif/IMG-SRIF-飞行器在环模块.jpg",
        imageWidth: 1800,
        imageHeight: 1349,
      },
      {
        id: "srif-prototype",
        name: "SRIF模块",
        description: "围绕机体、动力、飞控与感知定位，支持飞行器构型匹配、算法部署、标定和实机验证。",
      },
    ],
  },
];

export function productHref(lineId: ProductLineId, module: ProductModule) {
  return module.detailSlug ? `/solutions/${lineId}/${module.detailSlug}` : `/solutions#${module.id}`;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "intelligent-chassis-lab",
    name: "智能底盘实验室",
    type: "技术研发 · 实验室",
    description: "面向底盘控制、关键部件与跨域协同研发，构建软硬件联合验证环境。",
    image: "/assets/cases/CASE-001-智能底盘实验室.png",
    imageWidth: 1800,
    imageHeight: 1259,
    productLineIds: ["xil", "real-car"],
  },
  {
    id: "v2x-lab",
    name: "车路云实验室",
    type: "车路云 · 实验室",
    description: "打通车、路、云协同与虚实结合测试环境，支撑通信、感知和云控联调。",
    image: "/assets/cases/CASE-005-车路云实验室.png.png",
    imageWidth: 1800,
    imageHeight: 1348,
    productLineIds: ["real-car"],
  },
  {
    id: "low-altitude-center",
    name: "低空飞行实验中心",
    type: "低空飞行 · 研发教学",
    description: "建设飞控、感知、规划、仿真与实机验证相结合的低空研发教学平台。",
    image: "/assets/cases/CASE-008-低空飞行实验中心.png",
    imageWidth: 1800,
    imageHeight: 1071,
    productLineIds: ["srif"],
  },
  {
    id: "vehicle-in-loop-lab",
    name: "整车在环实验室",
    type: "整车验证 · 实验室",
    description: "以真实整车、道路负载与场景仿真构建可重复的整车级闭环环境。",
    image: "/assets/cases/CASE-011-整车在环实验室.png",
    imageWidth: 1800,
    imageHeight: 1301,
    productLineIds: ["xil"],
  },
];
