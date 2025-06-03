import { ControllerFieldState, ControllerRenderProps, } from "react-hook-form";

export type FieldProps = {
    field: ControllerRenderProps<any, any>;
    fieldState: ControllerFieldState;
};

export type FormInputInnerProps = {
    label: string;
    placeholder?: string;
    type?: string;
} & FieldProps;