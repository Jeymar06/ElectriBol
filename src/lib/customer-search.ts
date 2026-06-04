import { normalizeText } from '@/utils/format';

const synonymGroups = [
  ['bombillo', 'bombillos', 'foco', 'focos', 'lampara', 'lamparas', 'led'],
  ['reflector', 'reflectores', 'proyector', 'proyectores', 'exterior'],
  ['cable', 'cables', 'alambre', 'alambrado', 'conductor'],
  ['toma', 'tomas', 'tomacorriente', 'tomacorrientes', 'enchufe', 'enchufes'],
  ['breaker', 'breakers', 'automatico', 'proteccion', 'tablero'],
  ['interruptor', 'interruptores', 'suiche', 'switch'],
  ['extension', 'extensiones', 'multitoma', 'regleta'],
  ['plafon', 'plafones', 'panel', 'paneles', 'techo'],
];

function findSynonyms(token: string) {
  return synonymGroups.find((group) => group.includes(token)) || [token];
}

export function matchesCustomerSearch(haystack: string, query: string) {
  const normalizedHaystack = normalizeText(haystack);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  if (normalizedHaystack.includes(normalizedQuery)) {
    return true;
  }

  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => findSynonyms(token).some((synonym) => normalizedHaystack.includes(synonym)));
}

export const customerQuickSearches = [
  'Reflectores',
  'Bombillos LED',
  'Cables',
  'Tomacorrientes',
  'Breakers',
  'Interruptores',
];
