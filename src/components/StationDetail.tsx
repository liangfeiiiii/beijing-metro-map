import { useState } from 'react';
import { StationDetail as StationDetailType } from '../data/stationArticles';
import './StationDetail.css';

interface StationDetailProps {
  detail: StationDetailType;
  lineNames: string[];
  onClose: () => void;
}

const StationDetail: React.FC<StationDetailProps> = ({ detail, lineNames, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'operation' | 'science'>('overview');

  const sortedHistory = [...detail.history].sort((a, b) => a.year - b.year);

  const stationTypeMap = {
    underground: '地下站',
    elevated: '高架站',
    ground: '地面站'
  };

  const platformTypeMap = {
    island: '岛式站台',
    side: '侧式站台',
    mixed: '混合站台'
  };

  return (
    <div className="station-detail">
      <header className="station-header">
        <div className="station-header-top">
          <div className="station-title-group">
            <h2 className="station-name">{detail.name}</h2>
            <span className="station-pinyin">{detail.pinyin}</span>
          </div>
          <button type="button" className="station-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="station-badges">
          {lineNames.map((name, i) => (
            <span key={i} className="station-line-badge">{name}</span>
          ))}
          <span className="station-type-badge">{stationTypeMap[detail.stationType]}</span>
          <span className="station-platform-badge">{platformTypeMap[detail.platformType]}</span>
        </div>

        <div className="station-meta">
          <span className="station-meta-item">📅 开通日期：{detail.openDate}</span>
          <span className="station-meta-item">🚇 日均客流：{(detail.passengerVolume.daily / 10000).toFixed(1)}万人次</span>
          <span className="station-meta-item">⏰ 首班车：{detail.firstTrain}</span>
          <span className="station-meta-item">🌙 末班车：{detail.lastTrain}</span>
        </div>
      </header>

      <nav className="station-tabs">
        <button 
          type="button"
          className={`station-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button 
          type="button"
          className={`station-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          历史
        </button>
        <button 
          type="button"
          className={`station-tab ${activeTab === 'operation' ? 'active' : ''}`}
          onClick={() => setActiveTab('operation')}
        >
          运营
        </button>
        <button 
          type="button"
          className={`station-tab ${activeTab === 'science' ? 'active' : ''}`}
          onClick={() => setActiveTab('science')}
        >
          科普
        </button>
      </nav>

      <div className="station-content">
        {activeTab === 'overview' && (
          <div className="station-overview">
            <section className="detail-card">
              <h3 className="detail-card-title">简介</h3>
              <p className="detail-card-text">{detail.article.introZh}</p>
              <p className="detail-card-text-en">{detail.article.introEn}</p>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">设计特色</h3>
              <div className="detail-tags">
                {detail.designFeatures.map((feature, i) => (
                  <span key={i} className="detail-tag">{feature}</span>
                ))}
              </div>
            </section>

            {detail.trivia.length > 0 && (
              <section className="detail-card trivia-card">
                <h3 className="detail-card-title">🎯 趣味知识</h3>
                <ul className="trivia-list">
                  {detail.trivia.map((item, i) => (
                    <li key={i} className="trivia-item">{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {detail.nearbyAttractions.length > 0 && (
              <section className="detail-card">
                <h3 className="detail-card-title">📍 周边探索</h3>
                <div className="attractions-grid">
                  {detail.nearbyAttractions.map((attr, i) => (
                    <div key={i} className="attraction-card">
                      <div className="attraction-header">
                        <span className="attraction-name">{attr.name}</span>
                        <span className="attraction-type">{attr.type}</span>
                      </div>
                      <div className="attraction-distance">{attr.distance}</div>
                      <p className="attraction-desc">{attr.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="station-history">
            <section className="detail-card">
              <h3 className="detail-card-title">历史沿革</h3>
              <div className="timeline">
                {sortedHistory.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-content">
                      <div className="timeline-event">{item.event}</div>
                      <p className="timeline-desc">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">人文故事</h3>
              <p className="detail-card-text">{detail.culturalStory}</p>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">历史与空间</h3>
              <p className="detail-card-text">{detail.article.historyZh}</p>
              <p className="detail-card-text-en">{detail.article.historyEn}</p>
            </section>
          </div>
        )}

        {activeTab === 'operation' && (
          <div className="station-operation">
            <section className="detail-card">
              <h3 className="detail-card-title">换乘信息</h3>
              <div className="transfers-list">
                {detail.transfers.map((transfer, i) => (
                  <div key={i} className="transfer-item">
                    <span className="transfer-line">{transfer.line}</span>
                    <span className="transfer-distance">{transfer.distance}</span>
                    <span className="transfer-notes">{transfer.notes}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">出入口信息</h3>
              <div className="exits-grid">
                {detail.exits.map((exit, i) => (
                  <div key={i} className="exit-card">
                    <span className="exit-id">{exit.id}口</span>
                    <div className="exit-landmarks">
                      {exit.landmarks.map((landmark, j) => (
                        <span key={j} className="exit-landmark">{landmark}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">车型线索</h3>
              <p className="detail-card-text">{detail.article.stockZh}</p>
              <p className="detail-card-text-en">{detail.article.stockEn}</p>
            </section>
          </div>
        )}

        {activeTab === 'science' && (
          <div className="station-science">
            <section className="detail-card">
              <h3 className="detail-card-title">建筑与设计</h3>
              <p className="detail-card-text">{detail.architecture}</p>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">地质与工程</h3>
              <p className="detail-card-text">{detail.geology}</p>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">车型演变</h3>
              <div className="rolling-stock-table">
                <div className="rs-header">
                  <span>车型</span>
                  <span>服役年限</span>
                  <span>技术参数</span>
                </div>
                {detail.rollingStock.map((stock, i) => (
                  <div key={i} className="rs-row">
                    <span className="rs-model">{stock.model}</span>
                    <span className="rs-years">{stock.years}</span>
                    <span className="rs-specs">{stock.specs}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-card">
              <h3 className="detail-card-title">车型与发展</h3>
              <p className="detail-card-text">{detail.article.evolutionZh}</p>
              <p className="detail-card-text-en">{detail.article.evolutionEn}</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationDetail;