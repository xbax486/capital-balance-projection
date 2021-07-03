import { UserPrecondictions } from "./user.precondictions";
import { UserInputs } from "./user.inputs";
import { UserOutputs } from "./user.outputs";
import { CalculationDetails } from "./calculation.details";

export interface User {
    precondictions: UserPrecondictions;
    inputs: UserInputs;
    outputs: UserOutputs;
    calculationDetails: CalculationDetails
}