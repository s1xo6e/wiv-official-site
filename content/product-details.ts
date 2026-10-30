export type ProductDetailSeriesId = "xil" | "real-car";

export type ProductDetailItem = {
  name: string;
  description: string;
};

export type ProductDetail = {
  moduleId: string;
  seriesId: ProductDetailSeriesId;
  slug: string;
  sourcePage: number;
  intro: string;
  focus: string;
  composition: ProductDetailItem[];
  tests: ProductDetailItem[];
  applications: string[];
};

// Source pages refer to the 31-page wivSPACE_8.19 product manual.
// Scope and product-line associations follow the decisions in docs/PRD.md.
export const productDetails: ProductDetail[] = [
  {
    moduleId: "xil-vehicle",
    seriesId: "xil",
    slug: "vehicle",
    sourcePage: 5,
    intro: "将真实被测车辆接入道路行驶模拟平台，并与实时车辆动力学模型、智驾场景仿真相结合，在实验室中构建整车级闭环测试环境。围绕动力、三电功能和智能驾驶开展集成验证；根据测试需求，还可配合环境仓等外围设备，扩展热管理、续航和电耗研究。",
    focus: "真实整车参与的多系统集成验证",
    composition: [
      { name: "整车负载模拟系统", description: "以道路行驶模拟平台向真实车辆提供测试负载，衔接实车响应与仿真工况。" },
      { name: "动力学实时仿真系统", description: "运行车辆动力学模型，模拟被测车辆剩余部分的动态特性。" },
      { name: "智驾场景仿真系统", description: "构建道路、交通与环境场景，向整车智能驾驶测试提供场景输入。" },
      { name: "环境模拟系统（可选）", description: "按研究目标配合环境仓、全光谱系统等外围设备，扩展整车环境测试。" },
    ],
    tests: [
      { name: "智能驾驶功能安全", description: "围绕复杂工况下的系统运行开展功能安全测试，研究整车各系统的可靠性与协同响应。" },
      { name: "场景再现与评估", description: "复现城市道路、高速公路及特殊天气场景，评估系统在不同环境中的适应性。" },
      { name: "人机交互", description: "观察智能驾驶系统与驾驶员之间的操作和反馈，评估交互体验与使用安全。" },
      { name: "新能源整车测试", description: "配合相应外围环境，开展热管理、续航里程、电耗与整车标定测试。" },
      { name: "网联智驾验证", description: "将网联通信功能放入整车测试场景，验证通信与智能驾驶功能的配合。" },
    ],
    applications: ["整车动力与三电系统集成研发", "智能驾驶与网联场景验证", "新能源整车标定与环境适应性研究"],
  },
  {
    moduleId: "xil-driving",
    seriesId: "xil",
    slug: "driving",
    sourcePage: 6,
    intro: "以真实自动驾驶域控制器为被测硬件，将实时车辆动力学系统与高保真场景仿真连接，构成智驾功能的在环测试环境。研发人员可以在可重复的交通场景中验证感知、决策与控制算法，开展系统集成调试，并结合自动化测试组织后续迭代。",
    focus: "连接真实域控制器与虚拟交通场景",
    composition: [
      { name: "动力学实时仿真系统", description: "实时计算车辆动态响应，使控制器指令与虚拟车辆运动形成闭环。" },
      { name: "高保真场景仿真系统", description: "搭建城市道路、快速路和高速公路等交通环境，组织不同天气与交通流场景。" },
      { name: "智驾域控制器模组", description: "接入真实智驾域控制器硬件，结合开源算法开展功能开发、软硬件调试与系统验证。" },
    ],
    tests: [
      { name: "自动驾驶功能验证", description: "围绕自动泊车、自动变道与紧急制动等功能，检查控制器在场景中的决策与执行表现。" },
      { name: "感知系统测试", description: "在不同天气与道路条件下，研究雷达、激光雷达和摄像头等感知系统的表现。" },
      { name: "复杂交通场景", description: "模拟城市、快速路与高速公路交通流，观察系统面对交通参与者和复杂路况的响应。" },
      { name: "算法优化与调试", description: "对感知、决策和控制算法开展迭代测试，将场景反馈用于研发调试。" },
      { name: "系统接口与安全要求", description: "验证子系统协同和接口兼容性，并按研究需求组织相关安全要求与标准测试项目。" },
    ],
    applications: ["自动驾驶域控制器研发", "智驾算法闭环验证与迭代", "多子系统集成和自动化测试研究"],
  },
  {
    moduleId: "xil-chassis",
    seriesId: "xil",
    slug: "chassis",
    sourcePage: 7,
    intro: "在可控台架中模拟智能底盘横向、纵向与垂向动力学，连接仿真平台、真实控制器与关键零部件系统。覆盖EMB、轮毂电机、主动悬架和线控转向等研发对象，支持驱制动协同、跨域控制及故障工况验证，为控制算法迭代与软硬件联合调试提供实验环境。",
    focus: "底盘动态工况与跨域控制的台架验证",
    composition: [
      { name: "智能底盘仿真测试平台", description: "构建底盘动力学与动态加载环境，组织横向、纵向、垂向相关工况。" },
      { name: "智能底盘硬件在环系统", description: "连接实时仿真器和真实控制器，开展控制器在环测试与软硬件联合调试。" },
      { name: "关键零部件性能测试系统", description: "面向EMB、轮毂电机、主动悬架与线控转向等对象，配置部件及联合台架测试。" },
    ],
    tests: [
      { name: "EMB性能", description: "测试夹紧力输出与估计、驻车控制、制动响应与释放时间，以及卡钳能耗和耐久性。" },
      { name: "踏板感与交互", description: "研究踏板力与位移关系、动态反馈和故障模拟，评估制动操作的交互表现。" },
      { name: "驱制动与能量回收", description: "结合轮毂电机与EMB联合测试，验证回馈制动效率及再生制动与摩擦制动的协同策略。" },
      { name: "极限与动态工况", description: "在台架中组织ABS、ASR、ESC等主动安全系统的动态工况，研究底盘控制响应。" },
      { name: "控制算法在环验证", description: "通过控制器在环（C-/HIL）测试迭代算法，并研究不同底盘控制域之间的协同。" },
      { name: "故障与容错", description: "利用电源和故障仿真注入，评估冗余、软硬件监控及仲裁策略。" },
    ],
    applications: ["智能底盘跨域控制研发", "线控零部件性能与联合测试", "控制器算法及故障容错策略研究"],
  },
  {
    moduleId: "xil-cockpit",
    seriesId: "xil",
    slug: "cockpit",
    sourcePage: 8,
    intro: "以自动化测试平台连接座舱交互设备、车载系统接口与数据分析模块，将虚拟交互场景和真实硬件联动。围绕触控、语音、屏幕显示和外设连接，评估驾驶员操作到车载系统响应的过程，并将测试数据用于座舱功能调试和交互体验优化。",
    focus: "座舱交互与车载接口的自动化测试",
    composition: [
      { name: "自动化测试软件", description: "组织交互场景与测试任务，执行座舱功能验证并记录测试过程。" },
      { name: "触控传感器与交互设备", description: "模拟触控、语音等操作输入，配合车载系统开展交互性能测试。" },
      { name: "车载系统接口", description: "连接车载设备及通信接口，支持外设、电源、射频和信号传输测试。" },
      { name: "信号处理与数据分析模块", description: "采集与分析操作和响应数据，为交互评估及系统优化提供反馈。" },
    ],
    tests: [
      { name: "触控与屏幕显示", description: "测试触控成功率、响应时长与耐久性，并评估屏幕流畅性、亮度和仪表显示。" },
      { name: "语音交互", description: "测试语音唤醒和交互成功率、响应时长，研究不同交互场景中的语音操作表现。" },
      { name: "外设连接", description: "开展蓝牙、Wi-Fi和手机投屏连接测试，验证车载系统与外部设备的交互。" },
      { name: "电源适配", description: "测试供电适配范围、电压波动及断电条件下的系统响应。" },
      { name: "射频信号仿真", description: "组织GNSS信号与AM/FM收音机信号仿真测试，研究相关车载功能。" },
      { name: "信号传输", description: "验证CAN、LIN、以太网和I/O信号传输，检查交互设备与车载系统的接口连接。" },
    ],
    applications: ["智能座舱交互性能评估", "车载系统接口与功能联调", "座舱自动化测试方法研究"],
  },
  {
    moduleId: "xil-driver",
    seriesId: "xil",
    slug: "driver",
    sourcePage: 9,
    intro: "将真实驾驶员的操作接入实时车辆动力学与虚拟交通场景，结合模拟驾驶舱、视景影音及多模态反馈，构成人、车、路、环境闭环。研究团队可在实验室可控条件下重复场景，观察ADAS或自动驾驶功能中的驾驶员行为、交互体验与多任务操作表现。",
    focus: "真实驾驶员参与的行为与交互研究",
    composition: [
      { name: "驾驶舱实时操控系统", description: "采集驾驶员的操作输入，将真实人员的控制行为接入仿真闭环。" },
      { name: "高保真场景仿真系统", description: "构建虚拟道路与交通情境，用于驾驶行为、交互和驾驶辅助功能研究。" },
      { name: "动力学实时仿真系统", description: "根据驾驶员操作与系统控制计算车辆动态响应，保持场景内的人车联动。" },
      { name: "高沉浸视景影音系统", description: "结合视觉、听觉和相应体感反馈，呈现驾驶场景及车辆响应。" },
    ],
    tests: [
      { name: "驾驶员行为与体验", description: "研究驾驶员对系统的接受度、易用性和满意度，评估驾驶辅助功能与操作之间的关系。" },
      { name: "生理与心理反应研究", description: "按研究配置采集心率、脑电等生理信号，研究疲劳、注意力及驾驶任务之间的联系。" },
      { name: "多任务操作", description: "测试驾驶员并发执行任务时的效率与准确性，分析交互任务带来的操作负担。" },
      { name: "HMI与驾驶辅助协同", description: "评估车载HMI和其他驾驶辅助系统的协同工作、互动过程与响应。" },
      { name: "通信相关测试", description: "结合研究目标组织车辆之间、车辆与基础设施之间的通信测试。" },
    ],
    applications: ["ADAS与自动驾驶人机交互研究", "驾驶行为及人因实验", "多任务操作与座舱体验评估"],
  },
  {
    moduleId: "real-car-v2x",
    seriesId: "real-car",
    slug: "v2x",
    sourcePage: 12,
    intro: "在线控真车快速原型平台上搭载通信定位、环境感知、云控和网联智驾系统，组织车辆与道路、云端及路网图层之间的数据交互。面向车、路、云、网、图协同研究，支持网联智驾算法开发、实车通信测试与云平台联调，将协同控制策略接入实车验证。",
    focus: "车路云协同策略的实车开发与联调",
    composition: [
      { name: "线控车辆平台", description: "以真实车辆执行网联智驾控制指令，为功能开发和测试提供实车载体。" },
      { name: "通信及定位系统", description: "连接车辆通信与位置数据，支撑V2X、LTE等通信测试及路网场景研究。" },
      { name: "感知系统", description: "采集车辆周边环境信息，与云控感知增强及网联智驾研究衔接。" },
      { name: "云控系统", description: "接入云端数据和控制链路，开展车路云数据交互与云平台联调。" },
      { name: "网联智驾系统", description: "将V2X等网联信息用于驾驶决策与协同控制，支持算法部署和功能验证。" },
    ],
    tests: [
      { name: "实车通信", description: "围绕V2X、LTE等通信方式开展测试，检查车辆在网联场景中的数据交互。" },
      { name: "云控感知增强", description: "连接车辆感知与云控系统，研究协同感知信息对智驾功能的支持。" },
      { name: "网联智驾算法", description: "利用网联信息开展算法开发与验证，在真实路网图层相关场景中检查功能响应。" },
      { name: "云平台联调", description: "组织车辆与云平台之间的接口和功能联调，研究协同控制链路。" },
    ],
    applications: ["车路云协同控制研究", "网联智驾功能实车开发", "车端与云平台联合测试"],
  },
  {
    moduleId: "real-car-driving",
    seriesId: "real-car",
    slug: "driving",
    sourcePage: 13,
    intro: "基于真实量产乘用车开展底盘线控开发，配合通信定位、多模态环境感知、开源智驾算法与标定工具链，支持科研人员将算法部署到实车。围绕传感器标定、地图构建和路径规划开展调试，并通过实车功能验证反馈算法研发，衔接模型开发与工程实践。",
    focus: "面向算法部署与迭代的真车快速原型",
    composition: [
      { name: "线控车辆平台", description: "提供真实乘用车的线控执行基础，承接智能驾驶算法的控制指令。" },
      { name: "通信及定位系统", description: "为实车算法调试提供通信和定位数据，连接车辆状态与研发工具。" },
      { name: "多模态环境感知系统", description: "采集车辆周边环境信息，支持传感器标定、感知融合与智驾研究。" },
      { name: "智能驾驶系统", description: "结合开源智驾算法组织二次开发，部署并验证感知、规划和控制功能。" },
      { name: "标定工具链", description: "衔接算法部署、传感器标定和实车调试，为研发迭代提供工具支持。" },
    ],
    tests: [
      { name: "传感器标定", description: "围绕实车感知与定位系统开展标定，为后续算法开发准备传感器数据。" },
      { name: "地图构建", description: "利用实车平台的感知与定位信息，研究自动驾驶相关的地图构建方法。" },
      { name: "路径规划调试", description: "将路径规划算法接入实车，结合线控执行与环境反馈调试算法表现。" },
      { name: "自动驾驶功能验证", description: "部署并优化智驾功能，通过实车测试研究算法控制指令和车辆执行响应。" },
    ],
    applications: ["智能驾驶算法实车研发", "传感器标定与融合研究", "自动驾驶工程实践与教学"],
  },
  {
    moduleId: "real-car-virtual",
    seriesId: "real-car",
    slug: "virtual",
    sourcePage: 14,
    intro: "在测试台架基础上配套实时在环仿真系统与虚实融合测试框架，把高保真场景、交通流和传感器模型输入接入智能驾驶算法。通过衔接仿真与实车测试数据，组织功能验证和自动化测试，并在可控环境中研究恶劣天气、传感器失效与突发障碍物等复杂场景。",
    focus: "衔接场景仿真与实车数据的智驾测试",
    composition: [
      { name: "高保真场景与交通流仿真系统", description: "构建动态道路和交通参与者场景，为智能驾驶算法提供虚拟测试环境。" },
      { name: "传感器模型实时注入模块", description: "将仿真场景中的传感器模型输入接入测试过程，连接虚拟环境与被测系统。" },
      { name: "智能驾驶开源算法", description: "作为算法开发和验证基础，支持研究人员开展二次开发与功能调试。" },
      { name: "自动化测试框架", description: "组织场景执行与算法验证流程，衔接虚实融合测试数据。" },
    ],
    tests: [
      { name: "动态场景算法验证", description: "在实时虚拟交通场景中检查智能驾驶算法的功能与响应。" },
      { name: "虚实融合测试", description: "结合仿真与实车测试数据，研究智能驾驶算法在不同测试环节中的表现。" },
      { name: "复杂及危险场景复现", description: "构建恶劣天气、传感器失效和突发障碍物等场景，在测试环境中开展验证。" },
      { name: "全栈与自动化测试", description: "围绕智能驾驶全栈功能组织自动化验证，支持算法开发到工程实践的测试训练。" },
    ],
    applications: ["智能驾驶虚实融合验证", "复杂交通场景与自动化测试研究", "仿真测试与工程实践教学"],
  },
  {
    moduleId: "real-car-data",
    seriesId: "real-car",
    slug: "data",
    sourcePage: 15,
    intro: "在真车快速原型平台上部署多模态环境数据采集模块，连接感知定位、数据通信与边缘处理系统。通过图像、激光和毫米波等数据的同步采集与融合，记录道路、障碍物及交通参与者信息，为环境建模、自动驾驶算法验证和车路协同系统开发提供数据基础。",
    focus: "面向环境建模与算法研究的实车数采",
    composition: [
      { name: "数据采集平台", description: "组织实车环境数据采集，记录后续科研与工程研究所需的原始数据。" },
      { name: "感知及定位系统", description: "结合多模态感知与车辆定位，采集道路、障碍物和交通参与者信息。" },
      { name: "数据传输与通信系统", description: "连接采集设备与数据处理链路，支撑多模态数据传输。" },
      { name: "边缘计算与处理系统", description: "在采集平台侧进行数据处理，衔接多源数据采集与融合工作。" },
      { name: "模块化部署及标定工具链", description: "支持采集模块的部署与标定，适配科研和工程应用中的采集任务。" },
    ],
    tests: [
      { name: "多模态同步采集", description: "采集图像、激光、毫米波等数据，研究多源数据同步与融合。" },
      { name: "环境建模", description: "记录道路结构、障碍物和交通参与者细节，为环境模型构建提供数据。" },
      { name: "自动驾驶研究数据", description: "围绕自动驾驶算法验证组织采集任务，衔接后续算法研发与测试。" },
      { name: "车路协同数据采集", description: "结合车路协同系统开发需求，配置采集模块与数据处理链路。" },
    ],
    applications: ["多模态环境数据研究", "自动驾驶算法数据采集", "车路协同系统与环境建模开发"],
  },
  {
    moduleId: "real-car-energy",
    seriesId: "real-car",
    slug: "energy",
    sourcePage: 16,
    intro: "围绕整车能量分配和车路协同，将环境仿真与真车实路测试结合，搭建多工况能耗优化研发平台。借助开放的整车混动控制策略和虚实融合工具链，研究发动机、驱动电机与电池的协同控制，开展能量管理算法部署、标定及运行状态监控。",
    focus: "虚实结合的整车能量策略开发与标定",
    composition: [
      { name: "整车能量分配管理系统", description: "衔接内燃机、驱动电机与电池控制，为整车能耗优化算法提供部署基础。" },
      { name: "车路协同系统", description: "贯通车辆、道路和云端信息，为多元协同条件下的能量管理研究提供输入。" },
      { name: "融合感知定位系统", description: "获取车辆状态与运行环境信息，连接实路测试与控制策略研究。" },
      { name: "虚实融合策略控制工具链", description: "结合环境仿真和实路测试，支持能量管理策略部署、标定与工况切换。" },
    ],
    tests: [
      { name: "能量优化策略", description: "在仿真环境与真车实路相结合的条件下，开发和测试能量优化及动态调整策略。" },
      { name: "混动协同控制", description: "利用开放控制系统，研究内燃机、驱动电机与电池之间的能量分配和协调。" },
      { name: "算法部署与标定", description: "将能耗优化算法部署到实车控制链路，结合工况开展标定与测试。" },
      { name: "状态监控与工况研究", description: "实时监控车辆能耗及运动状态，切换研究所需运行环境，评估控制策略响应。" },
    ],
    applications: ["整车能量管理策略研究", "车路云协同能耗优化", "混动控制算法部署与标定"],
  },
  {
    moduleId: "real-car-chassis",
    seriesId: "real-car",
    slug: "chassis",
    sourcePage: 17,
    intro: "以线控底盘真车为载体，集成车辆状态感知、轨迹定位和多域协同控制，面向复杂与极限动态工况开展实车研发验证。结合部署与标定工具链，研究车辆操控、行驶稳定性和底盘控制优化，并可围绕特定工况及关键零部件系统配置验证平台。",
    focus: "智能底盘控制与关键部件的实车验证",
    composition: [
      { name: "线控底盘车辆平台", description: "作为底盘动态控制的实车执行载体，响应算法指令并开展工况测试。" },
      { name: "车辆状态感知与轨迹定位系统", description: "融合车辆运动状态与轨迹定位信息，为动态操控和稳定性研究提供反馈。" },
      { name: "多域协同控制模块", description: "连接智能底盘相关控制域，支持跨域控制算法部署与联合验证。" },
      { name: "部署与标定工具链", description: "衔接控制算法上车、系统调试和标定，支持实车验证过程中的研发迭代。" },
    ],
    tests: [
      { name: "动态操控与稳定性", description: "在复杂驾驶环境下研究车辆操控与行驶稳定性，观察底盘系统动态响应。" },
      { name: "极限动态控制", description: "围绕极限动态工况验证控制算法的实车执行响应，为底盘控制研究提供反馈。" },
      { name: "底盘控制优化", description: "结合车辆状态感知、定位和多域协同控制，开展系统调试与算法优化。" },
      { name: "关键零部件系统验证", description: "根据特定工况和零部件系统需求组织平台定制，开展相关软硬件实车验证。" },
    ],
    applications: ["智能底盘与车辆运动控制研究", "复杂工况操控及稳定性验证", "底盘关键零部件软硬件开发"],
  },
];

export function getProductDetail(seriesId: string, slug: string): ProductDetail | undefined {
  return productDetails.find((detail) => detail.seriesId === seriesId && detail.slug === slug);
}
