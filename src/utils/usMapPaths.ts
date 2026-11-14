import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import statesAlbers from 'us-atlas/states-albers-10m.json';
import { STATES_BY_FIPS } from '../game/statesData';
import { StateCode } from '../game/types';

export interface RenderedStateShape {
  code: StateCode;
  fips: string;
  path: string;
  labelX: number;
  labelY: number;
}

type Ring = number[][];

function ringAreaAndCentroid(ring: Ring): { area: number; cx: number; cy: number } {
  let area = 0;
  let cx = 0;
  let cy = 0;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % n];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    const first = ring[0] ?? [0, 0];
    return { area: 0, cx: first[0], cy: first[1] };
  }
  return {
    area: Math.abs(area),
    cx: cx / (6 * area),
    cy: cy / (6 * area),
  };
}

function ringsToSvgPath(rings: Ring[]): string {
  return rings
    .map((ring) => {
      if (ring.length === 0) return '';
      return (
        'M' +
        ring
          .map((pt) => `${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
          .join('L') +
        'Z'
      );
    })
    .join('');
}

const MANUAL_LABEL_OFFSETS: Partial<Record<StateCode, [number, number]>> = {
  FL: [14, 6],
  MI: [14, 18],
  LA: [-10, 4],
  AK: [0, -4],
  HI: [0, 0],
  CA: [-8, 8],
  ID: [0, 12],
  VA: [8, 4],
  NC: [8, 2],
  MD: [-4, -2],
};

let cachedShapes: RenderedStateShape[] | null = null;

export function getUsStateShapes(): RenderedStateShape[] {
  if (cachedShapes) return cachedShapes;

  const topology = statesAlbers as unknown as Topology<{
    states: GeometryCollection<{ name?: string }>;
  }>;

  const geo = feature(topology, topology.objects.states);
  const shapes: RenderedStateShape[] = [];

  for (const feat of geo.features) {
    const fips = String(feat.id ?? '').padStart(2, '0');
    const stateDef = STATES_BY_FIPS[fips];
    if (!stateDef || !feat.geometry) continue;

    let d = '';
    let bestRing: Ring = [];
    let bestArea = -1;

    if (feat.geometry.type === 'Polygon') {
      const coords = feat.geometry.coordinates as Ring[];
      d = ringsToSvgPath(coords);
      if (coords[0]) {
        bestRing = coords[0];
        bestArea = ringAreaAndCentroid(coords[0]).area;
      }
    } else if (feat.geometry.type === 'MultiPolygon') {
      const polys = feat.geometry.coordinates as Ring[][];
      d = polys.map((poly) => ringsToSvgPath(poly)).join('');
      for (const poly of polys) {
        if (!poly[0]) continue;
        const info = ringAreaAndCentroid(poly[0]);
        if (info.area > bestArea) {
          bestArea = info.area;
          bestRing = poly[0];
        }
      }
    }

    const centroid = ringAreaAndCentroid(bestRing);
    const offset = MANUAL_LABEL_OFFSETS[stateDef.code] ?? [0, 0];

    shapes.push({
      code: stateDef.code,
      fips,
      path: d,
      labelX: centroid.cx + offset[0],
      labelY: centroid.cy + offset[1],
    });
  }

  cachedShapes = shapes;
  return shapes;
}

export const SMALL_EAST_COAST_CALLOUTS: StateCode[] = [
  'VT',
  'NH',
  'MA',
  'RI',
  'CT',
  'NJ',
  'DE',
  'MD',
  'DC',
];
