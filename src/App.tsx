import { useMemo, useState } from "react";
import MetroMap from "./components/MetroMap";
import StationDetail from "./components/StationDetail";
import { prepareMapData, Station, Line } from "./data/metroData";
import { getStationDetail } from "./data/stationArticles";
import "./App.css";

export default function App() {
  const { stations, lines } = useMemo(() => prepareMapData(), []);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const filteredStations = useMemo(() => {
    if (!selectedLine) return stations;
    return stations.filter(s => s.lines.includes(selectedLine));
  }, [stations, selectedLine]);

  const lineNames = useMemo(() => {
    if (!selectedStation) return [];
    const map = new Map(lines.map((l: Line) => [l.id, l.name]));
    return selectedStation.lines.map((id: string) => map.get(id) ?? id);
  }, [selectedStation, lines]);

  const detail = useMemo(() => {
    if (!selectedStation) return null;
    return getStationDetail(selectedStation.name);
  }, [selectedStation]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">北京地铁小站书</h1>
        <p className="app-lead">
          在真实地图上叠加地铁线路，随手点开一座车站，读一点线路故事、车型线索与沿革。
        </p>
      </header>

      <div className="line-selector">
        <button
          type="button"
          className={`line-btn ${selectedLine === null ? 'active' : ''}`}
          onClick={() => setSelectedLine(null)}
        >
          全部
        </button>
        {lines.map((line: Line) => (
          <button
            key={line.id}
            type="button"
            className={`line-btn ${selectedLine === line.id ? 'active' : ''}`}
            style={{ '--line-color': line.color } as React.CSSProperties}
            onClick={() => setSelectedLine(line.id)}
          >
            {line.name}
          </button>
        ))}
      </div>

      <main className="app-stack">
        {!selectedStation ? (
          <section className="app-map" aria-label="线路图">
            <MetroMap
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              selectedLine={selectedLine}
              stations={filteredStations}
              lines={lines}
            />
          </section>
        ) : (
          <section className="app-reader" aria-live="polite">
            {detail ? (
              <StationDetail
                detail={detail}
                lineNames={lineNames}
                onClose={() => setSelectedStation(null)}
              />
            ) : (
              <div className="reader-sheet">
                <div className="reader-head">
                  <h2 className="reader-station">{selectedStation.name}</h2>
                  <p className="reader-lines">{lineNames.join('、')}</p>
                </div>
                <div className="reader-block">
                  <p className="reader-h">🚇 暂无详细数据</p>
                  <p className="reader-zh">
                    该站点的详细信息正在整理中，欢迎前往地图选择其他站点。
                  </p>
                  <p className="reader-en">
                    Station details are being compiled. Please pick another station from the map.
                  </p>
                </div>
                <button
                  type="button"
                  className="reader-close"
                  onClick={() => setSelectedStation(null)}
                >
                  ← 返回地图
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <span>科普向页面：内容便于建立直觉，细节请以运营方与权威资料为准。</span>
      </footer>
    </div>
  );
}