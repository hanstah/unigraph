import { Node } from "../model/Node";
import { SceneGraph } from "../model/SceneGraph";
import { NodePositionData } from "./layoutHelpers";
// import { multiLevel3DLayout } from "./o3-mini-high-layouts/no1";
// import { multiLevel3DLayout_2 } from "./o3-mini-high-layouts/no2";

export interface IGraphvizOutput {
  svg: string;
  positions: NodePositionData;
}

export interface INode3DPosition {
  x: number;
  y: number;
  z: number;
}

export type Node3DPositionData = { [key: string]: INode3DPosition };

export enum CustomLayoutType {
  Circular = "Circular",
  OrderedGrid = "OrderedGrid",
  Spherical = "Spherical",
  Box = "Box",
  Random = "Random",
  TypeDriven3D = "TypeDriven3D",
  ChatGptConversation = "ChatGptConversation", // Add new layout type
  // ImageGraph = "ImageGraph", // this one times out. it was generated be chatgpt
}

export const compute3DCircularLayout = (
  graph: SceneGraph
): Node3DPositionData => {
  const nodes = Array.from(graph.getGraph().getNodes());
  const positions: Node3DPositionData = {};

  // Group nodes by type
  const nodesByType = new Map<string, Node[]>();
  nodes.forEach((node) => {
    const type = node.getType() || "default";
    if (!nodesByType.has(type)) {
      nodesByType.set(type, []);
    }
    nodesByType.get(type)!.push(node);
  });

  // Sort types by size (largest first)
  const sortedTypes = Array.from(nodesByType.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  const baseSpacing = 200;
  const minRadius = baseSpacing;

  sortedTypes.forEach(([, groupNodes], sphereIndex) => {
    const nodesInSphere = groupNodes.length;

    // Calculate radius based on number of nodes
    const radius = Math.max(
      minRadius,
      (baseSpacing * Math.sqrt(nodesInSphere)) / (2 * Math.PI) +
        baseSpacing * sphereIndex
    );

    // Use the Fibonacci sphere algorithm for even distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    groupNodes.forEach((node, i) => {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodesInSphere);

      positions[node.getId()] = {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      };
    });
  });

  return positions;
};

export const compute3DBoxLayout = (sceneGraph: SceneGraph) => {
  const nodes = Array.from(sceneGraph.getGraph().getNodes());

  // Sort nodes first by type, then by tags
  const sortedNodes = nodes.sort((a, b) => {
    // Compare types first
    const typeA = a.getType() || "";
    const typeB = b.getType() || "";
    if (typeA !== typeB) {
      return typeA.localeCompare(typeB);
    }

    // If types are equal, compare tags
    const tagsA = a.getTags() || [];
    const tagsB = b.getTags() || [];
    const tagStrA = Array.from(tagsA).sort().join(",");
    const tagStrB = Array.from(tagsB).sort().join(",");
    return tagStrA.localeCompare(tagStrB);
  });

  const nodeCount = sortedNodes.length;
  const boxSize = Math.ceil(Math.pow(nodeCount, 1 / 3)); // cube root for 3D grid
  const spacing = 100; // Space between nodes

  const positions: NodePositionData = {};

  sortedNodes.forEach((node, index) => {
    const x = (index % boxSize) * spacing;
    const y = (Math.floor(index / boxSize) % boxSize) * spacing;
    const z = Math.floor(index / (boxSize * boxSize)) * spacing;

    positions[node.getId()] = {
      x: x - (boxSize * spacing) / 2,
      y: y - (boxSize * spacing) / 2,
      z: z - (boxSize * spacing) / 2,
    };
  });
  return positions;
};

const computeGridLayout = (graph: SceneGraph): NodePositionData => {
  const nodes = Array.from(graph.getGraph().getNodes());

  // Sort nodes first by type, then by tags
  const sortedNodes = nodes.sort((a, b) => {
    // Compare types first
    const typeA = a.getType() || "";
    const typeB = b.getType() || "";
    if (typeA !== typeB) {
      return typeA.localeCompare(typeB);
    }

    // If types are equal, compare tags
    const tagsA = a.getTags() || [];
    const tagsB = b.getTags() || [];
    const tagStrA = Array.from(tagsA).sort().join(",");
    const tagStrB = Array.from(tagsB).sort().join(",");
    return tagStrA.localeCompare(tagStrB);
  });

  const totalNodes = sortedNodes.length;
  const gridSize = Math.ceil(Math.sqrt(totalNodes));
  const spacing = 200; // Space between nodes
  const positions: NodePositionData = {};

  sortedNodes.forEach((node, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    positions[node.getId()] = {
      x: col * spacing,
      y: row * spacing,
    };
  });

  return positions;
};

const computeCircularLayout = (graph: SceneGraph): NodePositionData => {
  const nodes = Array.from(graph.getGraph().getNodes());
  const positions: NodePositionData = {};

  // Group nodes by type
  const nodesByType = new Map<string, Node[]>();
  nodes.forEach((node) => {
    const type = node.getType() || "default";
    if (!nodesByType.has(type)) {
      nodesByType.set(type, []);
    }
    nodesByType.get(type)!.push(node);
  });

  // Sort each group by tags
  nodesByType.forEach((groupNodes) => {
    groupNodes.sort((a, b) => {
      const tagsA = Array.from(a.getTags() || [])
        .sort()
        .join(",");
      const tagsB = Array.from(b.getTags() || [])
        .sort()
        .join(",");
      return tagsA.localeCompare(tagsB);
    });
  });

  // Sort types by number of nodes (largest groups first)
  const sortedTypes = Array.from(nodesByType.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  // Calculate positions in concentric circles
  const baseSpacing = 100; // Base spacing between circles
  const minRadius = baseSpacing; // Minimum radius for the smallest circle

  sortedTypes.forEach(([, groupNodes], circleIndex) => {
    const nodesInCircle = groupNodes.length;
    // Calculate radius based on number of nodes in the circle
    const radius = Math.max(
      minRadius,
      (baseSpacing * nodesInCircle) / (2 * Math.PI) + baseSpacing * circleIndex
    );

    groupNodes.forEach((node, index) => {
      const angle = (index / nodesInCircle) * 2 * Math.PI;
      positions[node.getId()] = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      };
    });
  });

  return positions;
};

export const computeRandom3dLayout = (
  sceneGraph: SceneGraph
): NodePositionData => {
  const nodes = Array.from(sceneGraph.getGraph().getNodes());
  const positions: NodePositionData = {};

  nodes.forEach((node) => {
    positions[node.getId()] = {
      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,
      z: Math.random() * 1000 - 500,
    };
  });

  return positions;
};

export const computeTypeDriven3DLayout = (
  sceneGraph: SceneGraph
): Node3DPositionData => {
  const nodes = Array.from(sceneGraph.getGraph().getNodes());
  const positions: Node3DPositionData = {};

  // Group nodes by type
  const nodesByType = new Map<string, Node[]>();
  nodes.forEach((node) => {
    const type = node.getType() || "default";
    if (!nodesByType.has(type)) {
      nodesByType.set(type, []);
    }
    nodesByType.get(type)!.push(node);
  });

  // Assign z positions based on type
  let zPosition = 0;
  const zSpacing = 200; // Space between different types
  const spacing = 100; // Space between nodes on x and y plane

  nodesByType.forEach((groupNodes) => {
    // Sort nodes within each type by the number of edges
    groupNodes.sort(
      (a, b) =>
        sceneGraph.getGraph().getEdgesOf(b).length -
        sceneGraph.getGraph().getEdgesOf(a).length
    );

    groupNodes.forEach((node, index) => {
      const x = (index % Math.sqrt(groupNodes.length)) * spacing;
      const y = Math.floor(index / Math.sqrt(groupNodes.length)) * spacing;

      positions[node.getId()] = {
        x: x - (Math.sqrt(groupNodes.length) * spacing) / 2,
        y: y - (Math.sqrt(groupNodes.length) * spacing) / 2,
        z: zPosition,
      };
    });
    zPosition += zSpacing;
  });

  return positions;
};

export const computeImageGraphLayout = (
  sceneGraph: SceneGraph
): Node3DPositionData => {
  const nodes = Array.from(sceneGraph.getGraph().getNodes());
  const positions: Node3DPositionData = {};

  const sourceNodes: Node[] = [];
  // Group nodes by imageUrl
  const nodesByImage = new Map<string, Node[]>();
  nodes.forEach((node) => {
    if (node.getType() === "image") {
      sourceNodes.push(node);
    }
    const userData = node.getData().userData;
    if (userData?.imageUrl) {
      const imageUrl = userData.imageUrl;
      if (!nodesByImage.has(imageUrl)) {
        nodesByImage.set(imageUrl, []);
      }
      nodesByImage.get(imageUrl)!.push(node);
    }
  });

  // Assign z positions based on imageUrl and organize nodes in a grid
  let zPosition = 0;
  const zSpacing = 500; // Increased space between different images
  let xySpacing = 100; // Space between nodes in same image group

  nodesByImage.forEach((groupNodes) => {
    // Calculate grid dimensions
    const gridSize = Math.ceil(Math.sqrt(groupNodes.length));

    // Position nodes in a centered grid
    groupNodes.forEach((node, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      positions[node.getId()] = {
        x: (col - gridSize / 2) * xySpacing,
        y: (row - gridSize / 2) * xySpacing,
        z: zPosition,
      };
    });

    zPosition += zSpacing;
  });

  // Position nodes in a centered grid
  // Calculate grid dimensions
  zPosition += zSpacing * 3;
  xySpacing = 200; // Increased space between different images
  const gridSize = Math.ceil(Math.sqrt(sourceNodes.length));
  sourceNodes.forEach((node, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    positions[node.getId()] = {
      x: (col - gridSize / 2) * xySpacing,
      y: (row - gridSize / 2) * xySpacing,
      z: zPosition,
    };
  });

  return positions;
};

/**
 * Creates a layout optimized for ChatGPT conversations
 * Conversations are laid out in rows, with the longest conversation at the top
 * Each conversation is a horizontal chain of messages
 */
export const computeChatGptConversationLayout = (
  sceneGraph: SceneGraph
): NodePositionData => {
  const positions: NodePositionData = {};
  const graph = sceneGraph.getGraph();
  const nodes = Array.from(graph.getNodes());
  const edges = Array.from(graph.getEdges());

  // Step 1: Find conversation thread nodes
  const conversationNodes = nodes.filter(
    (node) => node.getType() === "ConversationThread"
  );

  // Step 2: Get message chains for each conversation
  interface ConversationChain {
    conversationId: string;
    messages: {
      id: string;
      nextId?: string;
    }[];
  }

  const conversationChains: ConversationChain[] = [];

  // For each conversation thread
  for (const conversationNode of conversationNodes) {
    const conversationId = conversationNode.getId();
    const chain: ConversationChain = {
      conversationId,
      messages: [],
    };

    // Find all messages that are contained in this conversation
    const containsEdges = edges.filter(
      (edge) =>
        edge.getType() === "contains" && edge.getSource() === conversationId
    );

    // Get all message nodes in this conversation
    const messageIds = containsEdges.map((edge) => edge.getTarget());
    const messageNodes = messageIds.map((id) => graph.getNode(id));

    // Create a map of message IDs to their objects for quick lookup
    const messageMap = new Map();
    messageNodes.forEach((node) => {
      messageMap.set(node.getId(), {
        id: node.getId(),
        nextId: undefined,
      });
    });

    // Connect messages in sequence using "nextMessage" edges
    const nextMessageEdges = edges.filter(
      (edge) => edge.getType() === "nextMessage"
    );
    for (const edge of nextMessageEdges) {
      const source = edge.getSource();
      const target = edge.getTarget();

      if (messageMap.has(source)) {
        const message = messageMap.get(source);
        message.nextId = target;
      }
    }

    // Find starting message (one with no previous message)
    const targetIds = new Set(nextMessageEdges.map((edge) => edge.getTarget()));
    const startingMessageIds = Array.from(messageMap.keys()).filter(
      (id) => !targetIds.has(id)
    );

    // Build chains from starting messages
    for (const startId of startingMessageIds) {
      let currentId = startId;
      const messageChain = [];

      // Follow the chain of messages
      while (currentId) {
        if (messageMap.has(currentId)) {
          const message = messageMap.get(currentId);
          messageChain.push(message);
          currentId = message.nextId;
        } else {
          break;
        }
      }

      chain.messages = [...chain.messages, ...messageChain];
    }

    // If we found any messages, add this chain
    if (chain.messages.length > 0) {
      conversationChains.push(chain);
    }
  }

  // Step 3: Sort conversations by length (longest first)
  conversationChains.sort((a, b) => b.messages.length - a.messages.length);

  // Step 4: Position the nodes in rows
  const spacing = 150; // Space between messages
  const rowHeight = 200; // Space between conversation rows

  conversationChains.forEach((chain, rowIndex) => {
    // Position conversation node on the left side
    positions[chain.conversationId] = {
      x: -spacing,
      y: rowIndex * rowHeight,
      z: 0,
    };

    // Position message nodes in sequence
    chain.messages.forEach((message, colIndex) => {
      positions[message.id] = {
        x: colIndex * spacing,
        y: rowIndex * rowHeight,
        z: 0,
      };
    });
  });

  return positions;
};

export const computeCustomLayout = (
  sceneGraph: SceneGraph,
  layoutType: CustomLayoutType = CustomLayoutType.Box
): NodePositionData => {
  let positions: NodePositionData;
  switch (layoutType) {
    case CustomLayoutType.Circular:
      positions = computeCircularLayout(sceneGraph);
      break;
    case CustomLayoutType.OrderedGrid:
      positions = computeGridLayout(sceneGraph);
      break;
    case CustomLayoutType.Spherical:
      positions = compute3DCircularLayout(sceneGraph);
      break;
    case CustomLayoutType.Box:
      positions = compute3DBoxLayout(sceneGraph);
      break;
    case CustomLayoutType.Random:
      positions = computeRandom3dLayout(sceneGraph);
      break;
    case CustomLayoutType.TypeDriven3D:
      positions = computeTypeDriven3DLayout(sceneGraph);
      break;
    case CustomLayoutType.ChatGptConversation: // Add new case
      positions = computeChatGptConversationLayout(sceneGraph);
      break;
    // case CustomLayoutType.ImageGraph: // times out. was made by chatgpt
    // positions = computeImageGraphLayout(sceneGraph);
    // break;
    default:
      positions = {};
      break;
  }
  return positions;
};
