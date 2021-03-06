import { CategoricalFieldWrapper, TemporalFieldWrapper, ContinuousFieldWrapper, IdFieldWrapper, DataModel as WasmDataModel, DataModelMeta as WasmMeta, ProjectDataModel as WasmProjectDm, SplitDataModel as WasmSplitDm } from '../../../../../webassembly/pkg/datamodel_wasm';
import { memory as WasmMemory } from '../../../../../webassembly/pkg/datamodel_wasm_bg';
import { recursiveSanitizeQuery as selectionSanitizeQuery, getRawValue } from './select-utils';
declare type WasmFieldTypes = CategoricalFieldWrapper | ContinuousFieldWrapper | TemporalFieldWrapper | IdFieldWrapper;
export { WasmFieldTypes, WasmDataModel, WasmMemory, WasmMeta, selectionSanitizeQuery, WasmProjectDm, WasmSplitDm, CategoricalFieldWrapper, TemporalFieldWrapper, ContinuousFieldWrapper, IdFieldWrapper, getRawValue, };
