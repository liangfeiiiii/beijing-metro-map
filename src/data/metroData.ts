import stationJSON from './raw/station.json';
import { getCoordsByName } from './beijingMetroCoords';

export interface Station {
  id: string;
  name: string;
  lng: number;
  lat: number;
  x: number;
  y: number;
  lines: string[];
}

export interface Line {
  id: string;
  name: string;
  color: string;
  stationIds: string[];
}

export interface Segment {
  fromId: string;
  toId: string;
  lineId: string;
}

const LINE_COLORS: Record<string, string> = {
  '1': '#c23a30',
  '2': '#0065b0',
  '4': '#009e96',
  '5': '#a8278e',
  '6': '#d29e00',
  '7': '#009966',
  '8': '#008899',
  '9': '#71c5a8',
  '10': '#c6d200',
  '11': '#8b0063',
  '13': '#ffd400',
  '14': '#fabf3e',
  '15': '#915fad',
  '16': '#7ec6e9',
  'S1': '#b74d47',
  'S1线': '#b74d47',
  '燕房线': '#d656a4',
  '房山线': '#ff6f00',
  '亦庄线': '#d83587',
  '八通线': '#e95419',
  '昌平线': '#ff6fb1',
  '大兴机场': '#ff0000',
  '首都机场线': '#555555',
  '西郊线': '#c88632',
  '大兴线': '#c23a30',
  '3': '#ff8232',
  '12': '#98b42c',
  '17': '#8fd1c8',
  '18': '#c23a30',
  '19': '#9b7ebe'
};

const LINE_NAMES: Record<string, string> = {
  '1': '1号线',
  '2': '2号线',
  '3': '3号线',
  '4': '4号线',
  '5': '5号线',
  '6': '6号线',
  '7': '7号线',
  '8': '8号线',
  '9': '9号线',
  '10': '10号线',
  '11': '11号线',
  '12': '12号线',
  '13': '13号线',
  '14': '14号线',
  '15': '15号线',
  '16': '16号线',
  '17': '17号线',
  '18': '18号线',
  '19': '19号线',
  'S1': 'S1线',
  'S1线': 'S1线',
  '燕房线': '燕房线',
  '房山线': '房山线',
  '亦庄线': '亦庄线',
  '八通线': '八通线',
  '昌平线': '昌平线',
  '大兴机场': '大兴机场线',
  '首都机场线': '首都机场线',
  '西郊线': '西郊线',
  '大兴线': '大兴线'
};

interface JsonStation {
  id: number;
  lineno: string;
  name: string;
}

export function parseStations(): Station[] {
  const jsonStations = stationJSON as JsonStation[];
  const stations: Station[] = [];
  const nameToId = new Map<string, string>();

  jsonStations.forEach((jsonStation) => {
    const coords = getCoordsByName(jsonStation.name);
    if (!coords) return;

    const id = String(jsonStation.id);
    nameToId.set(jsonStation.name, id);

    const lineStr = jsonStation.lineno || '';
    const lines = lineStr.split(',').map(l => l.trim()).filter(l => l);

    stations.push({
      id,
      name: jsonStation.name,
      lng: coords.lng,
      lat: coords.lat,
      x: 0,
      y: 0,
      lines
    });
  });

  return stations;
}

export function prepareMapData() {
  const stations = parseStations();

  const lats = stations.map(s => s.lat);
  const lngs = stations.map(s => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const padding = 50;
  const mapWidth = 1200 - padding * 2;
  const mapHeight = 1000 - padding * 2;

  stations.forEach(station => {
    station.x = padding + ((station.lng - minLng) / (maxLng - minLng)) * mapWidth;
    station.y = padding + ((maxLat - station.lat) / (maxLat - minLat)) * mapHeight;
  });

  const lineMap = new Map<string, { id: string; name: string; color: string; stationIds: string[] }>();

  stations.forEach(station => {
    station.lines.forEach(lineId => {
      if (!lineMap.has(lineId)) {
        lineMap.set(lineId, {
          id: lineId,
          name: LINE_NAMES[lineId] || lineId + '号线',
          color: LINE_COLORS[lineId] || '#888888',
          stationIds: []
        });
      }
      lineMap.get(lineId)!.stationIds.push(station.id);
    });
  });

  const lines = Array.from(lineMap.values());
  const segments: Segment[] = [];

  lines.forEach(line => {
    for (let i = 0; i < line.stationIds.length - 1; i++) {
      segments.push({
        fromId: line.stationIds[i],
        toId: line.stationIds[i + 1],
        lineId: line.id
      });
    }
  });

  return { stations, lines, segments };
}