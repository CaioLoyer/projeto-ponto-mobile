export type Ponto = {
  id: number;
  nomeFuncionario: string;
  foto: Uint8Array;
  latitude: number;
  longitude: number;
  dataHora: string;
  distanciaMetros: number;
  validado: number; 
  empresaId: number;
};

export type NovoPonto = {
  nomeFuncionario: string;
  foto: Uint8Array;
  latitude: number;
  longitude: number;
  dataHora: string;
  distanciaMetros: number;
  validado: boolean;
  empresaId: number;
};
