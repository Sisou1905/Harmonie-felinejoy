import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom Node Component
const CustomNode = ({ data }) => {
  const nodeStyles = {
    root: "bg-[#5FA098] text-white border-2 border-white shadow-lg",
    branch: "bg-[#A9D6E5] text-[#1A2F23] border-2 border-white shadow-md",
    leaf: "bg-white text-[#5C6B64] border-2 border-[#D1E8E2] shadow-sm",
  };

  return (
    <div
      className={`px-6 py-4 rounded-2xl min-w-[140px] text-center font-medium transition-transform hover:scale-105 ${
        nodeStyles[data.type] || nodeStyles.leaf
      }`}
    >
      {data.icon && <span className="mr-2">{data.icon}</span>}
      <span className="font-body">{data.label}</span>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const MindMap = ({ nodes: initialNodes, edges: initialEdges, title }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const defaultEdgeOptions = {
    style: { stroke: "#B0C4DE", strokeWidth: 2 },
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#B0C4DE",
    },
  };

  return (
    <div
      className="h-[500px] md:h-[600px] w-full bg-[#F5F7F6] rounded-[2rem] border-4 border-white shadow-inner-soft overflow-hidden"
      data-testid={`mindmap-${title?.toLowerCase().replace(/\s+/g, "-") || "default"}`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#D1E8E2" gap={20} />
        <Controls
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-soft"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
};

export default MindMap;

// Pre-built Mind Map Configurations
export const humanWellnessNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 50 },
    data: { label: "Bien-être Humain", type: "root" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 150, y: 180 },
    data: { label: "Corps", type: "branch" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 400, y: 180 },
    data: { label: "Esprit", type: "branch" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 650, y: 180 },
    data: { label: "Émotions", type: "branch" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 50, y: 320 },
    data: { label: "Nutrition", type: "leaf" },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 200, y: 320 },
    data: { label: "Exercice", type: "leaf" },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 300, y: 320 },
    data: { label: "Méditation", type: "leaf" },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 450, y: 320 },
    data: { label: "Sommeil", type: "leaf" },
  },
  {
    id: "9",
    type: "custom",
    position: { x: 580, y: 320 },
    data: { label: "Gestion stress", type: "leaf" },
  },
  {
    id: "10",
    type: "custom",
    position: { x: 730, y: 320 },
    data: { label: "Relations", type: "leaf" },
  },
];

export const humanWellnessEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
  { id: "e2-5", source: "2", target: "5" },
  { id: "e2-6", source: "2", target: "6" },
  { id: "e3-7", source: "3", target: "7" },
  { id: "e3-8", source: "3", target: "8" },
  { id: "e4-9", source: "4", target: "9" },
  { id: "e4-10", source: "4", target: "10" },
];

export const animalWellnessNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 50 },
    data: { label: "Bien-être Félin", type: "root" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 150, y: 180 },
    data: { label: "Santé Physique", type: "branch" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 400, y: 180 },
    data: { label: "Comportement", type: "branch" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 650, y: 180 },
    data: { label: "Environnement", type: "branch" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 50, y: 320 },
    data: { label: "Alimentation", type: "leaf" },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 200, y: 320 },
    data: { label: "Vétérinaire", type: "leaf" },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 300, y: 320 },
    data: { label: "Langage corporel", type: "leaf" },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 470, y: 320 },
    data: { label: "Socialisation", type: "leaf" },
  },
  {
    id: "9",
    type: "custom",
    position: { x: 580, y: 320 },
    data: { label: "Enrichissement", type: "leaf" },
  },
  {
    id: "10",
    type: "custom",
    position: { x: 730, y: 320 },
    data: { label: "Espace sécurisé", type: "leaf" },
  },
];

export const animalWellnessEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-4", source: "1", target: "4" },
  { id: "e2-5", source: "2", target: "5" },
  { id: "e2-6", source: "2", target: "6" },
  { id: "e3-7", source: "3", target: "7" },
  { id: "e3-8", source: "3", target: "8" },
  { id: "e4-9", source: "4", target: "9" },
  { id: "e4-10", source: "4", target: "10" },
];

export const connectionNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 50 },
    data: { label: "Connexion Humain-Animal", type: "root" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 200, y: 180 },
    data: { label: "Bienfaits Mutuels", type: "branch" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 600, y: 180 },
    data: { label: "Communication", type: "branch" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 100, y: 320 },
    data: { label: "Réduction stress", type: "leaf" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 250, y: 320 },
    data: { label: "Santé cardiaque", type: "leaf" },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 400, y: 320 },
    data: { label: "Bonheur partagé", type: "leaf" },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 550, y: 320 },
    data: { label: "Comprendre son chat", type: "leaf" },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 700, y: 320 },
    data: { label: "Lien émotionnel", type: "leaf" },
  },
];

export const connectionEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e2-5", source: "2", target: "5" },
  { id: "e2-6", source: "2", target: "6" },
  { id: "e3-7", source: "3", target: "7" },
  { id: "e3-8", source: "3", target: "8" },
];
