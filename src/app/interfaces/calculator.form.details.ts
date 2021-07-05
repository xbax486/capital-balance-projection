import { UserPreconditions } from "./user.preconditions";
import { UserInputs } from "./user.inputs";

export interface CalculatorFormDetails {
    preconditions: UserPreconditions;
    inputs: UserInputs;
}