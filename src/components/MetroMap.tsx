import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Station, Line } from '../data/metroData';
import './MetroMap.css';

interface MetroMapProps {
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  selectedLine: string | null;
  stations: Station[];
  lines: Line[];
}

const BEIJING_CENTER: [number, number] = [39.9042, 116.4074];
const DEFAULT_ZOOM = 11;

function MapController({ selectedStation }: { selectedStation: Station | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStation) {
      map.flyTo([selectedStation.lat, selectedStation.lng], 14, {
        duration: 0.5
      });
    }
  }, [selectedStation, map]);

  return null;
}

const MetroMap: React.FC<MetroMapProps> = ({
  selectedStation,
  onSelectStation,
  selectedLine,
  stations,
  lines
}) => {
  const lineStations = useMemo(() => {
    const lineStationMap = new Map<string, Station[]>();
    stations.forEach(station => {
      station.lines.forEach(lineId => {
        if (!lineStationMap.has(lineId)) {
          lineStationMap.set(lineId, []);
        }
        lineStationMap.get(lineId)!.push(station);
      });
    });
    return lineStationMap;
  }, [stations]);

  const getLineColor = (lineId: string): string => {
    const line = lines.find(l => l.id === lineId);
    return line?.color || '#888888';
  };

  const getStationColor = (station: Station): string => {
    return getLineColor(station.lines[0]);
  };

  const isStationHighlighted = (station: Station): boolean => {
    if (!selectedStation) return false;
    if (selectedStation.id === station.id) return true;
    return selectedStation.lines.some(lineId => station.lines.includes(lineId));
  };

  const visibleLineIds = useMemo(() => {
    if (selectedLine) return [selectedLine];
    return lines.map(l => l.id);
  }, [selectedLine, lines]);

  return (
    <div className="metro-map-container">
      <MapContainer
        center={BEIJING_CENTER}
        zoom={DEFAULT_ZOOM}
        className="metro-map"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedStation={selectedStation} />

        {lines.filter(line => visibleLineIds.includes(line.id)).map(line => {
          const stationsForLine = lineStations.get(line.id) || [];
          if (stationsForLine.length < 2) return null;

          const positions: [number, number][] = stationsForLine.map(s => [s.lat, s.lng]);
          const isSelected = selectedLine === line.id;
          const isHighlighted = selectedStation?.lines.includes(line.id);

          return (
            <Polyline
              key={line.id}
              positions={positions}
              pathOptions={{
                color: line.color,
                weight: isSelected || isHighlighted ? 6 : 4,
                opacity: isSelected || isHighlighted ? 1 : 0.6
              }}
            />
          );
        })}

        {stations.map(station => {
          const isSelected = selectedStation?.id === station.id;
          const isHighlighted = isStationHighlighted(station);
          const color = getStationColor(station);
          const isVisible = !selectedLine || station.lines.includes(selectedLine);

          if (!isVisible) return null;

          return (
            <CircleMarker
              key={station.id}
              center={[station.lat, station.lng]}
              radius={isSelected ? 10 : isHighlighted ? 7 : 5}
              pathOptions={{
                color: isSelected ? '#fff' : color,
                fillColor: isSelected ? color : color,
                fillOpacity: isSelected ? 1 : 0.8,
                weight: isSelected ? 3 : 1.5
              }}
              eventHandlers={{
                click: () => onSelectStation(station)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <span className="station-tooltip">{station.name}</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MetroMap;