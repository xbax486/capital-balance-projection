import { UserPreconditions } from "./user.preconditions";
import { UserInputs } from "./user.inputs";
import { UserOutputs } from "./user.outputs";
import { CalculationDetails } from "./calculation.details";

export interface User {
    preconditions: UserPreconditions;
    inputs: UserInputs;
    outputs: UserOutputs;
    calculationDetails: CalculationDetails
}