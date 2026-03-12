import "./CreateTextKeyLanguage.css";
import type { TextValues } from "../../../api";
import { Input, Textarea } from "@digdir/designsystemet-react";

type CreateTextKeyLanguageProps = {
    values: TextValues;
    onChange: (field: keyof TextValues, value: string) => void;
};

const CreateTextKeyLanguagePage = ({ values, onChange }: CreateTextKeyLanguageProps) => {
    return (
        <div className="create-text-key-language">
            <div className="create-text-key-language_field">
            <label htmlFor="bokmal-text">Bokmål</label>
                <Textarea 
                    id="bokmal-text"
                    value={values.bokmål}
                    onChange={(e) => onChange("bokmål", e.target.value)}
                />
            </div>

            <div className="create-text-key-language_field">
            <label htmlFor="nynorsk-text">Nynorsk</label>
                <Textarea 
                    id="nynorsk-text"
                    value={values.nynorsk}
                    onChange={(e) => onChange("nynorsk", e.target.value)}
                />
            </div>

            <div className="create-text-key-language_field">
                <label htmlFor="english-text">Engelsk</label>
                <Textarea 
                    id="english-text"
                    value={values.engelsk}
                    onChange={(e) => onChange("engelsk", e.target.value)}
                />
            </div>
        </div>
    );
};

export default CreateTextKeyLanguagePage;