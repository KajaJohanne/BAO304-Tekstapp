import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveApplication } from "../../../../api";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Hva skjemaet inneholder
type FormFields = { 
  name: string; 
  sections: { name: string }[]; 
}

// Oversikt over hvilet trinn i prosessen 
type Step = 1 | 2 | 3; 


const CreateApplicationPage = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>(1); 

  const { register, handleSubmit, control, getValues, trigger, formState: { errors } } = useForm<FormFields>({
    defaultValues: {
      name: "", 
      sections: [], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, 
    name: "sections", 
  }); 


  const onSubmit = async (data: FormFields) => {
    // TODO oppdater saveApplication til å støtte sections og fjern description 
    const error = await saveApplication({
      name: data.name.trim(), 
      description: "", 
    }); 

    if (error) {
      toast.error(`Noe gikk galt: ${error}`); 
    } else {
      toast.success(`Applikasjonen "${data.name.trim()}" ble opprettet!`); 
      navigate("/home"); 
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>

      <button onClick={() => navigate("/home")}>← Tilbake</button>

      <h1>Opprett applikasjon</h1>

      {/* For å vise trinn */}
      <p>Trinn {currentStep} av 3</p>

      {/* Trinn 1 Navn */}
      {currentStep === 1 && (
        <div>
          <h2>Navn på applikasjon</h2>
          <p>Fyll inn navnet på applikasjonen du vil opprette.</p>

          <div style={{ marginBottom: "16px" }}>
            <label>Navn</label>
            <input
              type="text"
              placeholder="Feks. Trafikk"
              {...register("name", {
                required: "Du må gi et navn til applikasjonen", 
              })} 
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
            {errors.name && (
              <p style={{ color: "red", marginTop: "0.25rem"}}>{errors.name.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={async () => {
              // Valider navn
              const isValid = await trigger("name"); 
              if (isValid) setCurrentStep(2); 
            }}
          >
            Neste →
          </button>
        </div>
      )}

      {/* Trinn 2 Kategorier */}
      {currentStep === 2 && (
        <div>
          <h2>Kategorier</h2>
          <p>Legg til kategorer for applikasjonen. Dette er valgfritt og kan også gjøres senere.</p>

          {fields.map((field, index) => (
            <div key={field.id} style={{ display: "flex", gap: "0.5rem"}}>
              <input 
                type="text"
                placeholder="Feks: Reiseinformasjon"
                {...register(`sections.${index}.name`)}
                style={{ flex: 1 }}
              />
              <button type="button" onClick={() => remove(index)}>x</button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "" })}
            style={{ display: "block", marginBottom: "1rem" }}
          >
            + Legg til kategori
          </button>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={() => setCurrentStep(1)}>← Tilbake</button>
            <button type="button" onClick={() => setCurrentStep(3)}>Neste →</button>
          </div>
        </div>
      )}

      {/* Trinn 3 Oppsummering */}
      {currentStep === 3 && (
        <div>
          <h2>Oppsummering</h2>
          <p>Se over informasjonen før du oppretter applikasjonen.</p>

          <div style={{ marginBottom: "16px" }}>
            <strong>Navn</strong>
            <p>{getValues("name")}</p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Kategorier:</strong>
            {getValues("sections").filter(s => s.name.trim() !== "").length === 0 ? (
              <p>Ingen kategorer lagt til</p>
            ) : (
              <ul>
                {getValues("sections")
                .filter(s => s.name.trim() !== "") 
                .map((section, index) => (
                  <li key={index}>{section.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" onClick={() => setCurrentStep(2)}>← Tilbake</button>
            {/* handleSubmit validerer skjeamet før onSubmit kalles */}
            <button type="button" onClick={handleSubmit(onSubmit)}>
              Opprett applikasjon
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreateApplicationPage;
