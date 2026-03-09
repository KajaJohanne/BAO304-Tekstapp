/* 
    Kilde 
    https://www.youtube.com/watch?v=cc_xmawJ8Kg  
    https://react-hook-form.com/docs/usefieldarray
*/

import { useFieldArray, useForm } from "react-hook-form";
import type { Application } from "../types";
import toast from "react-hot-toast";

// Definerer hva skjemaet inneholder, altså det brukeren fyller inn 
type FormFields = {
    name: string; 
    sections: { name: string }[]; 
}

interface AddApplicationFormModalProps {
    isVisible: boolean; 
    onClose: () => void; 
    onAdd: (application: Application) => void; 
}

const AddApplicationFromModal = ({ isVisible, onClose, onAdd}: AddApplicationFormModalProps) => {

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            name: "", 
            sections: [], 
        },
    }); 

    const { fields, append, remove } = useFieldArray({
        control, 
        name: "sections", 
    }); 

    const onSubmit = (data: FormFields) => {
        const newApplication: Application = {
            id: crypto.randomUUID(), //genererer unik id, kan fjernes når firestore er klart 
            name: data.name.trim(), 
            createdAt: new Date(), 
            // Filtrer ut tomme kategorifelt og bygg section objekter
            sections: data.sections
                .filter((s) => s.name.trim() !== "")
                .map((s) => ({
                    id: crypto.randomUUID(), //genererer unik id, kan fjernes når firestore er klart 
                    name: s.name.trim(),
                })),
        }; 

        // send til homepage for lagring
        onAdd(newApplication); 
        toast.success(`Applikasjonen "${data.name.trim()}" ble opprettet`);
        onClose(); 
    }
    
    if (!isVisible) return null; 

    return (
        <div onClick={onClose} style={{
            position: "fixed", 
            inset: 0, 
            backgroundColor: "rgba(68, 79, 85, 0.6)",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            zIndex: 100,
        }}>
            <div onClick={(e) => e.stopPropagation()} style={{
                backgroundColor: "#F5F5F5", 
                padding: "2rem", 
                borderRadius: "8px", 
                width: "100%", 
                maxWidth: "500px", 
                display: "flex", 
                flexDirection: "column", 
                gap: "1rem", 
            }}>
                <h2>Legg til ny applikasjon</h2>
                <p>Her kan du opprette en ny applikasjon og kategoriene som hører til den.</p>
                <p>Hvis du ønsker flere nivåer med underkategorier, må du først trykke "Legg til applikasjon", og deretter redigere videre.</p>


                {/* handleSubmit fra useForm validerer feltene før onSubmit kalles */}
                <form onSubmit={handleSubmit(onSubmit)}>
                {/* Applikasjonsnavn */}
                <div>
                    <label>Navn på applikasjon</label>
                    <input 
                        type="text"
                        placeholder="Feks. Trafikk"
                        {...register("name", { 
                            required: "Du må fylle ut navn på applikasjonen før den kan opprettes",
                            // TODO leggt til duplikatsjekk når firestore er klart 
                        })}
                        style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
                    />
                    {errors.name && (
                        <p style={{ color: "red", marginTop: "0.25rem" }}>{errors.name.message}</p>
                    )}
                </div>

                {/* Kategorifelt */}
                <div>
                    <label>Kategorier</label>
                    {fields.map((field, index) => (
                        <div key={field.id} style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem"}}>
                            <input 
                                type="text"
                                placeholder="Feks. Reiseinformasjon"
                                {...register(`sections.${index}.name`)}
                                style={{ flex: 1 }}
                            />
                            <button type="button" onClick={() => remove(index)}>x</button>
                        </div>
                    ))}

                    {/* Kategori knapp */}
                    <button
                        type="button"
                        onClick={() => append({ name: "" })}
                        style={{ marginTop: "0.5rem" }}
                    >
                        Legg til kategori
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <button type="button" onClick={onClose}>Avbryt</button>
                    <button type="submit">Opprett applikasjon</button>
                </div>

                </form>
            </div> 
        </div>
    )
}

export default AddApplicationFromModal; 
