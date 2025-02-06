
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeData } from './types';

interface CustomNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

const CustomNode = ({ data, selected }: CustomNodeProps) => {
  return (
    <div
      className={`px-4 py-2 rounded-lg shadow-md transition-shadow duration-200 ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      style={{
        background: data.color,
        fontSize: `${data.fontSize}px`,
        color: getContrastColor(data.color),
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <span className="font-medium">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

export default memo(CustomNode);
