import { UserPrecondictions } from "./user.precondictions";
import { UserInputs } from "./user.inputs";
import { UserOutputs } from "./user.outputs";

export interface User {
    precondictions: UserPrecondictions;
    inputs: UserInputs;
    outputs: UserOutputs;
}