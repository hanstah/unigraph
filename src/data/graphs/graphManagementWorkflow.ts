import { Graph } from "../../core/model/Graph";
import { SceneGraph } from "../../core/model/SceneGraph";

export const graphManagementWorkflowDiagram = () => {
  const graph = new Graph();

  // Create nodes for the workflow
  graph.createNode({
    id: "TextDefinedGraph",
    type: "concept pillar",
    tags: ["graph source", "story entrypoint"],
  });

  graph.createNode({
    id: "Graphviz",
    type: "graph software",
    tags: ["graph software", "story entrypoint"],
  });

  graph.createNode({
    id: "MermaidJS",
    type: "graph software",
    tags: ["graph software", "story entrypoint"],
  });

  graph.createNode({
    id: "SVG",
    type: "output format",
    tags: ["visualization"],
  });

  graph.createNode({
    id: "Unigraph",
    type: "concept pillar",
    tags: ["unigraph", "story entrypoint", "graph software"],
  });

  graph.createNode({
    id: "UpdatePositions",
    type: "operation",
    tags: ["graph operation"],
  });

  graph.createNode({
    id: "UpdateOpacity",
    type: "operation",
    tags: ["graph operation"],
  });

  graph.createNode({
    id: "UpdateSizes",
    type: "operation",
    tags: ["graph operation"],
  });

  graph.createNode({
    id: "UpdateColors",
    type: "operation",
    tags: ["graph operation"],
  });

  graph.createNode({
    id: "UnigraphModelGraph",
    type: "concept pillar",
    tags: ["graph model"],
  });

  graph.createNode({
    id: "Export",
    type: "operation",
    tags: ["graph operation"],
  });

  // Create edges between nodes
  graph.createEdge("TextDefinedGraph", "Graphviz", { type: "converts to" });
  graph.createEdge("Graphviz", "SVG", { type: "outputs" });
  graph.createEdge("TextDefinedGraph", "MermaidJS", { type: "converts to" });
  graph.createEdge("MermaidJS", "SVG", { type: "outputs" });
  graph.createEdge("SVG", "Unigraph", { type: "imports into" });
  graph.createEdge("TextDefinedGraph", "Unigraph", { type: "inputs to" });
  graph.createEdge("Unigraph", "UpdatePositions", { type: "enables" });
  graph.createEdge("Unigraph", "UpdateOpacity", { type: "enables" });
  graph.createEdge("Unigraph", "UpdateSizes", { type: "enables" });
  graph.createEdge("Unigraph", "UpdateColors", { type: "enables" });
  graph.createEdge("UpdateOpacity", "UnigraphModelGraph", { type: "modifies" });
  graph.createEdge("UpdateSizes", "UnigraphModelGraph", { type: "modifies" });
  graph.createEdge("UpdatePositions", "UnigraphModelGraph", {
    type: "modifies",
  });
  graph.createEdge("UpdateColors", "UnigraphModelGraph", { type: "modifies" });
  graph.createEdge("UnigraphModelGraph", "Export", { type: "outputs to" });
  graph.createEdge("Export", "TextDefinedGraph", { type: "creates" });

  // console.log("journal", graphManagementWorkflowDiagram);
  return new SceneGraph({ graph });
};
