import type { TextValues } from "../../api";

export type CreateTextKeyLanguageProps = {
    values: TextValues;
    onChange: (field: keyof TextValues, value: string) => void;
    errors?: {
        bokmål?: string;
        nynorsk?: string;
        engelsk?: string;
    };
};