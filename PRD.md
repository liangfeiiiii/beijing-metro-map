# 北京地铁小站书 - 站点详情页 PRD

## 1. 项目概述

**产品名称**：北京地铁小站书  
**目标用户**：地铁爱好者、通勤族、对北京城市历史感兴趣的市民  
**核心价值**：让每一次地铁出行，都成为一次城市探索

## 2. 现状问题

当前站点详情页仅包含：
- 简介（2句话）
- 历史与空间（2句话）
- 车型线索（2句话）
- 车型与发展（2句话）

**问题**：
- 内容过于简略，缺乏深度
- 没有图片/视觉元素
- 缺少互动性（如 trivia、时间线）
- 没有与真实地铁运营的连接（首末班车、换乘信息）

## 3. 目标设计

### 3.1 内容架构（每个站点）

#### A. 站点名片（顶部固定区域）
- 站点名称（中文 + 拼音）
- 所属线路（彩色标签）
- 站点编号（如 L1-05）
- 开通日期
- 站点类型（地下/地面/高架）
- 站台类型（岛式/侧式/混合）

#### B. 视觉展示区
- 站点实景照片（或AI生成的艺术化插图）
- 站台设计特色（如壁画、灯光、建筑风格）
- 周边地标地图（微缩地图显示500米范围）

#### C. 历史时间线
- 建站背景（为什么在这里设站）
- 开通时间线
- 重要改造/升级记录
- 历史照片对比（如有）

#### D. 运营信息
- 首末班车时间（实时或标准时刻）
- 换乘信息（可换乘线路及步行距离）
- 出入口信息（A/B/C/D口及对应地标）
- 无障碍设施

#### E. 深度科普
- **建筑与设计**：站台设计理念、建筑师/设计团队、材料工艺
- **地质与工程**：地质条件、施工难点、技术创新
- **人文故事**：站名由来、周边历史、文化典故
- **车型演变**：该线路使用过的所有车型、技术参数对比
- **客流数据**：日均客流量、高峰时段、客流特征

#### F. 互动元素
- ** trivia 问答**：关于该站的趣味知识（如"你知道这个站曾经叫过别的名字吗？"）
- **周边探索**：推荐步行可达的景点、美食、文化场所
- **用户贡献**：允许用户提交该站的故事/照片（未来功能）

### 3.2 视觉设计

- **卡片式布局**：每个模块独立成卡，便于阅读和导航
- **时间线可视化**：横向或纵向时间线展示历史
- **数据可视化**：客流图表、车型对比表
- **地图集成**：显示站点在整条线路中的位置
- **响应式设计**：适配手机和桌面

### 3.3 交互设计

- **标签导航**：顶部标签快速切换模块
- **展开/收起**：长内容默认收起，点击展开
- **图片轮播**：多张照片可滑动查看
- **分享功能**：生成该站点的精美卡片分享

## 4. 技术实现

### 4.1 数据层
- 每个站点一个 JSON 文件或数据库记录
- 字段设计：
  ```typescript
  interface StationDetail {
    id: string;
    name: string;
    pinyin: string;
    lines: string[];
    openDate: string;
    stationType: 'underground' | 'elevated' | 'ground';
    platformType: 'island' | 'side' | 'mixed';
    
    // 视觉
    photos: string[];
    designFeatures: string[];
    
    // 历史
    history: {
      year: number;
      event: string;
      description: string;
    }[];
    
    // 运营
    firstTrain: string;
    lastTrain: string;
    transfers: {
      line: string;
      distance: string;
      notes: string;
    }[];
    exits: {
      id: string;
      landmarks: string[];
    }[];
    
    // 科普
    architecture: string;
    geology: string;
    culturalStory: string;
    rollingStock: {
      model: string;
      years: string;
      specs: string;
    }[];
    passengerVolume: {
      daily: number;
      peak: string;
    };
    
    // 互动
    trivia: string[];
    nearbyAttractions: {
      name: string;
      type: string;
      distance: string;
      description: string;
    }[];
  }
  ```

### 4.2 组件架构

```
StationDetailPage
├── StationHeader（站点名片）
├── PhotoGallery（照片画廊）
├── HistoryTimeline（历史时间线）
├── OperationInfo（运营信息）
├── DeepDiveSection（深度科普 - 标签页）
│   ├── ArchitectureTab
│   ├── GeologyTab
│   ├── CulturalTab
│   └── RollingStockTab
├── TriviaCard（趣味问答）
└── NearbyExploration（周边探索）
```

## 5. 内容来源

- **官方资料**：北京地铁官网、北京市规划和自然资源委员会
- **历史档案**：北京城市建设档案馆
- **技术文献**：地铁设计规范、工程论文
- **用户贡献**：地铁爱好者社群、本地居民故事
- **AI辅助**：用AI生成基于真实数据的科普内容（需人工审核）

## 6. 开发优先级

### Phase 1（MVP）
- [ ] 扩展数据模型，增加新字段
- [ ] 重写 StationDetail 组件，采用卡片式布局
- [ ] 添加历史时间线组件
- [ ] 丰富现有15个站点的内容

### Phase 2
- [ ] 添加运营信息（首末班车、换乘）
- [ ] 添加车型演变对比表
- [ ] 添加 trivia 趣味问答
- [ ] 添加周边探索推荐

### Phase 3
- [ ] 添加照片画廊
- [ ] 添加客流数据可视化
- [ ] 添加分享功能
- [ ] 用户贡献功能

## 7. 成功指标

- 用户在详情页停留时间 > 2分钟
- 用户主动点击多个标签页
- 分享功能使用次数
- 用户反馈"学到了新知识"

---

*PRD 版本：v1.0*  
*创建日期：2026-04-10*  
*状态：草案，待评审*
