
export interface NodeData {
  label: string;
  color: string;
  fontSize: number;
}

export interface HistoryAction {
  type: 'color' | 'fontSize' | 'position';
  nodeId: string;
  oldValue: any;
  newValue: any;
}

export interface NodePosition {
  x: number;
  y: number;
}
