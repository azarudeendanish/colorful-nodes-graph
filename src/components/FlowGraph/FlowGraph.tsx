
import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { Controls as CustomControls } from './Controls';
import { NodeData, HistoryAction } from './types';
import { toast } from "sonner";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node<NodeData>[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i}`,
  type: 'custom',
  data: {
    label: `Node ${i + 1}`,
    color: '#e6e6e6',
    fontSize: 14,
  },
  position: {
    x: Math.cos((i / 10) * Math.PI * 2) * 200 + 350,
    y: Math.sin((i / 10) * Math.PI * 2) * 200 + 350,
  },
}));

const initialEdges: Edge[] = Array.from({ length: 15 }, (_, i) => ({
  id: `e${i}`,
  source: `${Math.floor(Math.random() * 10)}`,
  target: `${Math.floor(Math.random() * 10)}`,
  animated: true,
  style: { stroke: '#999' },
}));

export const FlowGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((action: HistoryAction) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), action];
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const handleConnect = useCallback((params: Edge | Connection) => {
    setEdges(eds => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const getCurrentNodeData = useCallback(() => {
    if (!selectedNode) return null;
    return nodes.find(n => n.id === selectedNode)?.data;
  }, [selectedNode, nodes]);

  const handleColorChange = useCallback((color: string) => {
    if (!selectedNode) return;
    const oldData = getCurrentNodeData();
    if (!oldData) return;

    addToHistory({
      type: 'color',
      nodeId: selectedNode,
      oldValue: oldData.color,
      newValue: color,
    });

    setNodes(nds =>
      nds.map(node =>
        node.id === selectedNode
          ? { ...node, data: { ...node.data, color } }
          : node
      )
    );
  }, [selectedNode, getCurrentNodeData, setNodes, addToHistory]);

  const handleFontSizeChange = useCallback((fontSize: number) => {
    if (!selectedNode) return;
    const oldData = getCurrentNodeData();
    if (!oldData) return;

    addToHistory({
      type: 'fontSize',
      nodeId: selectedNode,
      oldValue: oldData.fontSize,
      newValue: fontSize,
    });

    setNodes(nds =>
      nds.map(node =>
        node.id === selectedNode
          ? { ...node, data: { ...node.data, fontSize } }
          : node
      )
    );
  }, [selectedNode, getCurrentNodeData, setNodes, addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return;

    const action = history[historyIndex];
    setNodes(nds =>
      nds.map(node =>
        node.id === action.nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [action.type]: action.oldValue,
              },
            }
          : node
      )
    );
    setHistoryIndex(prev => prev - 1);
    toast("Action undone");
  }, [history, historyIndex, setNodes]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const action = history[historyIndex + 1];
    setNodes(nds =>
      nds.map(node =>
        node.id === action.nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [action.type]: action.newValue,
              },
            }
          : node
      )
    );
    setHistoryIndex(prev => prev + 1);
    toast("Action redone");
  }, [history, historyIndex, setNodes]);

  const currentNodeData = getCurrentNodeData();

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>

      <CustomControls
        selectedNode={selectedNode}
        onColorChange={handleColorChange}
        onFontSizeChange={handleFontSizeChange}
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        currentColor={currentNodeData?.color || '#e6e6e6'}
        currentFontSize={currentNodeData?.fontSize || 14}
      />
    </div>
  );
};
