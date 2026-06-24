export const RAIO_VALIDACAO_METROS = 20;

export function calcularDistanciaMetros(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const RAIO_TERRA_METROS = 6371000;

  const toRad = (graus: number) => (graus * Math.PI) / 180;

  const deltaLat = toRad(latitudeB - latitudeA);
  const deltaLon = toRad(longitudeB - longitudeA);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRad(latitudeA)) *
      Math.cos(toRad(latitudeB)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RAIO_TERRA_METROS * c;
}

export function base64ParaBytes(base64: string): Uint8Array {
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }
  return bytes;
}

export function bytesParaBase64(bytes: Uint8Array): string {
  let binario = "";
  for (let i = 0; i < bytes.length; i++) {
    binario += String.fromCharCode(bytes[i]);
  }
  return btoa(binario);
}

export function formatarDataHora(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleString("pt-BR");
}
