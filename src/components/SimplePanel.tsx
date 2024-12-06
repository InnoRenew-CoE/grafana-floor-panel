import React, { useCallback, useState } from 'react';
import { FieldColorModeId, fieldColorModeRegistry } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { Props } from '../@types/PanelProps';
import { SensorData, Series } from '../@types/QueryData';
import { Room } from '../@types/Graphics';
import Rainbow from 'rainbowvis.js';
import { now } from 'lodash';
import DOMPurify from 'dompurify';

type Color = {
  name: string;
  value: number;
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, fieldConfig }) => {
  const [id] = useState(() => now());
  let theme = useTheme2();
  const fieldColor = fieldConfig.defaults.color || { mode: FieldColorModeId.ContinuousGrYlRd };
  const fieldColorMode = fieldColorModeRegistry.get(fieldColor.mode);
  const [roomMetrics] = useState(() => new Map<string, number>());
  const [rooms, setRooms] = useState<Room[]>(() => []);
  const [interval] = useState({ id: 0 });
  const [rainbow] = useState(() => new Rainbow());
  const [container, setContainer] = useState<SVGElement | undefined>(undefined);
  const [settings] = useState<{ colors: Color[] }>(() => ({ colors: [{ name: 'transparent', value: 0 }] }));
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  if (fieldColorMode.getColors) {
    const colors = fieldColorMode.getColors(theme);
    settings.colors = colors.map((x, i) => ({ name: x, value: i / colors.length }));
  } else if (fieldColorMode.id === 'thresholds') {
    const colors =
      fieldConfig.defaults.thresholds?.steps.map((x) => ({ name: x.color, value: Math.max(x.value, 0) })) ?? [];
    settings.colors = colors.sort((a, b) => a.value - b.value);
  }
  rainbow.setSpectrumByArray(settings.colors.map((x) => theme.visualization.getColorByName(x.name)));
  const all: Room[] = parseRooms(options.svg).map((name) => ({ name: name, quality: 80 }));
  if (all.some((x) => !rooms.some((y) => x.name === y.name))) {
    setRooms(all);
  }

  if (now() - lastUpdate > 3000) {
    setLastUpdate(now());
    const measurements: SensorData[] = mapData(data.series as unknown as Series[]);
    const sensorMappings: Map<string, string> = new Map(
      options.sensorMappings ? JSON.parse(options.sensorMappings) : []
    );
    for (let sensorData of measurements) {
      const room = sensorMappings.get(sensorData.id);
      if (!room) continue;
      const values = sensorData.values;
      const iaq = calculateIAQ(
        values.get('CO2') || values.get('co2') || 0.0,
        values.get('temperature') || 0.0,
        0,
        values.get('VOC_index') || 0.0
      ); // + random(-50, 50, false);
      roomMetrics.set(room, iaq);
    }
  }

  clearInterval(interval.id);
  if (container) {
    interval.id = window.setInterval(
      () => animateQualityTransition(id, rainbow, settings.colors, container, rooms, roomMetrics, interval.id),
      50
    );
  }

  const svgRef = useCallback(
    (node: any) => {
      if (node instanceof HTMLElement) {
        node.innerHTML = DOMPurify.sanitize(options.svg);
        const svg = node.getElementsByTagName('svg')[0];
        if (svg) {
          setContainer(svg);
          svg.removeAttribute('width');
          svg.removeAttribute('height');
        }
      }
    },
    [options]
  );
  const colorsCount = settings.colors.length;
  const firstColor = theme.visualization.getColorByName(settings.colors[0].name);
  const lastColor = theme.visualization.getColorByName(settings.colors[colorsCount - 1].name);

  return (
    <div
      style={{
        display: 'grid',
        gap: '2em',
        gridTemplateRows: '1fr auto',
        flexWrap: 'wrap',
        width: width,
        height: height,
      }}
    >
      <div
        ref={svgRef}
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      ></div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '300px', width: '80%' }}>
          <div
            style={{
              borderRadius: '3px',
              padding: '0.5em',
              background: `linear-gradient(90deg, ${firstColor} 0%, ${lastColor} 100%)`,
            }}
          ></div>
          <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
            <span>Bad</span>
            <span>Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function mapData(series: Series[]) {
  return series
    .map((s) => {
      const time = (s.fields.find((x) => x.name === '_time')?.values?.get(0) as number) ?? Date.now();
      const fieldOrder = s.fields.find((x) => x.name === '_field');
      if (!fieldOrder) return null;
      const fields = fieldOrder.values;
      const sensorId = fieldOrder.labels.sensor_id;
      const fieldValues = s.fields.find((x) => x.name === '_value')?.values ?? [];
      const valueMap = new Map<string, number>();
      for (let i = 0; i < fields.length; i++) {
        valueMap.set(fields[i], parseFloat(fieldValues[i]));
      }
      return { id: sensorId, values: valueMap, time: time } as SensorData;
    })
    .filter((x) => x) as SensorData[];
}

/**
 * Slowly and smoothly recolors rooms to avoid flickering
 * @param rainbow
 * @param colors
 * @param container
 * @param rooms
 * @param roomMetrics
 * @param intervalId
 */
function animateQualityTransition(
  id: number,
  rainbow: Rainbow,
  colors: Color[],
  container: SVGElement,
  rooms: Room[],
  roomMetrics: Map<string, number>,
  intervalId: number
) {
  const redrawNeeded = rooms.filter((room) => {
    const metric = roomMetrics.get(room.name);
    if (!metric) return false;
    return metric !== room.quality;
  });
  redrawNeeded.forEach((room) => {
    const desiredIAQ = roomMetrics.get(room.name);
    if (desiredIAQ) {
      const difference = Math.abs(desiredIAQ - room.quality);
      const add = desiredIAQ > room.quality ? 1 : -1;
      room.quality += add * Math.min(difference, 1);
    }
  });
  rooms
    .filter((r) => roomMetrics.get(r.name))
    .forEach((room) => {
      const roomElement = container.querySelector(`#room\\:${room.name.replace(/\./g, '\\.')}`);
      if (roomElement) {
        createOrModifyRadialGradient(id, container, { name: rainbow.colorAt(room.quality), value: 0 }, room);
        roomElement.setAttribute('fill', `url(#rg-${id}-${room.name})`);
        //roomElement.setAttribute("fill", `#${rainbow.colorAt(room.quality)}`)
        roomElement.setAttribute('fill-opacity', '1');
      }
    });
  if (redrawNeeded.length === 0) {
    clearInterval(intervalId);
  }
}

/**
 * Calculates Indoor Air Quality based on a few parameters.
 * @param co2
 * @param temp
 * @param rh
 * @param voc
 */
function calculateIAQ(co2: number, temp: number, rh: number, voc: number) {
  const co2Index = Math.min(6, Math.round(co2 / 400)); // 1 - 6
  const vocIndex = Math.min(6, Math.round(voc / 50)); // 1 - 6
  const worstOfTheTwo = Math.max(co2Index, vocIndex);
  const worst = 6;
  const aqi = Math.min(Math.max(0, 100.0 - 100 * (co2Index / worst)), 100);
  return aqi ?? 0.0;
}

export function parseRooms(svg: string) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(svg, 'image/svg+xml');
  const rooms = parsed.querySelectorAll('[id*="room"]');
  const roomNames: string[] = [...rooms].map((x) => x.id.replace(/room:/g, ''));
  return roomNames;
}

function createOrModifyRadialGradient(id: number, container: SVGElement, rightColor: Color, room: Room) {
  let gradientElement = container.querySelector(`#rg-${id}-${room.name.replace(/\./g, '\\.')}`);
  if (!gradientElement) {
    gradientElement = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradientElement.setAttribute('id', `rg-${id}-${room.name}`);
    container.appendChild(gradientElement);
  }
  gradientElement.setAttribute('r', '0%');
  gradientElement.innerHTML = `
    <stop offset="0.1" stop-color="transparent" />
    <stop offset="1" stop-color="#${rightColor.name}" />
    `;
}
