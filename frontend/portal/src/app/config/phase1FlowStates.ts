export interface Phase1RequiredFlowState {
  state: string;
  label: string;
  objective: string;
  required: boolean;
}

export interface Phase1FlowStateMap {
  title: string;
  notes: string;
  requiredStates: Phase1RequiredFlowState[];
}

export type Phase1FlowStateRegistry = Record<string, Phase1FlowStateMap>;
