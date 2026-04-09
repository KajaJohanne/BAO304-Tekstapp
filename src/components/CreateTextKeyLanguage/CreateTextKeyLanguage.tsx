import "./CreateTextKeyLanguage.css";
import { Textarea } from "@digdir/designsystemet-react";
import type { CreateTextKeyLanguageProps } from "../../types/createTextKeyLanguage";

const CreateTextKeyLanguagePage = ({ values, onChange, errors, }: CreateTextKeyLanguageProps) => {
    return (
        /* Inputfelt for bokmål */
        <div className="create-text-key-language">
            <div className="create-text-key-language_field">
            <label htmlFor="bokmal-text">Bokmål</label>
                <Textarea 
                    className="myTextarea"
                    id="bokmal-text" rows={4}
                    value={values.bokmål}
                    onChange={(e) => onChange("bokmål", e.target.value)}
                    maxLength={10000}
                />
                {/* Feilmelding bokmål felt */}
                {errors?.bokmål && <p className="field-error">{errors.bokmål}</p>}
            </div>

            {/* Inputfelt for nynorsk */}
            <div className="create-text-key-language_field">
            <label htmlFor="nynorsk-text">Nynorsk</label>
                <Textarea
                    className="myTextarea"
                    id="nynorsk-text" rows={4}
                    value={values.nynorsk} 
                    onChange={(e) => onChange("nynorsk", e.target.value)}
                    maxLength={10000}
                />
                {/* Feilmelding nynorsk felt */}
                {errors?.nynorsk && <p className="field-error">{errors.nynorsk}</p>}
            </div>

            {/* Inputfelt for engelsk */}
            <div className="create-text-key-language_field">
                <label htmlFor="english-text">Engelsk</label>
                <Textarea
                    className="myTextarea"
                    id="english-text" rows={4}
                    value={values.engelsk}
                    onChange={(e) => onChange("engelsk", e.target.value)}
                    maxLength={10000}
                />
                {/* Feilmelding engelsk felt */}
                {errors?.engelsk && <p className="field-error">{errors.engelsk}</p>}
            </div>
        </div>
    );
};

export default CreateTextKeyLanguagePage;