import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveApplication, applicationExists } from "../../../../api";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./CreateApplicationPage.css"

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

  // Bruker react hook form for å håndtere oppretting av ny applikasjon
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
    const error = await saveApplication({
      name: data.name.trim(), 
      sections: data.sections 
        .filter(s => s.name.trim() !== "")
        .map(s => ({
          name: s.name.trim(), 
          subSections: [], //tom ved opprettelse
        })), 
    }); 

    if (error) {
      toast.error(`Noe gikk galt: ${error}`); 
    } else {
      toast.success(`Applikasjonen "${data.name.trim()}" ble opprettet!`); 
      navigate("/home"); 
    }
  }

  return (
    <div className="create-application">

      <button onClick={() => navigate("/home")}>← Tilbake</button>

      <h1>Opprett applikasjon</h1>

      {/* Stegindikator */}
      <div className="step-indicator">

        <div className={`step ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}> 
          <div className="step-number">1</div>
          <span>Navn</span>
        </div>

        <div className="step-divider"/>

        <div className={`step ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}> 
          <div className="step-number">2</div>
          <span>Kategorier</span>
        </div>

        <div className="step-divider"/>

        <div className={`step ${currentStep === 3 ? "active" : ""}`}> 
          <div className="step-number">3</div>
          <span>Oppsummering</span>
        </div>


      </div>

      {/* Trinn 1 Navn */}
      {currentStep === 1 && (
        <div className="step-content">
          <h2>Navn på applikasjon</h2>
          <p>Fyll inn navnet på applikasjonen du vil opprette.</p>

          <div style={{ marginBottom: "16px" }}>
            <label>Navn</label>
            <input
              type="text"
              placeholder="Feks. Trafikk"
              {...register("name", {
                required: "Du må gi et navn til applikasjonen", 
                pattern: {
                  value: /^[a-zA-ZæøåÆØÅ0-9\s]+$/,
                  message: "Navnet kan bare inneholde bokstaver og tall"
                },
                validate: async (value) => {
                  // Sjekker mot firestore om navnet finnes 
                  const exists = await applicationExists(value.trim()); 
                  if (exists) {
                    return "Det finnes allerede en applikasjon med dette navnet, velg et annet";
                  }
                  return true; 
                }
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
        <div className="step-content">
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

      {/* TODO!!!!! stilsett knapper!! */}

      {/* Trinn 3 Oppsummering */}
      {currentStep === 3 && (
        <div className="step-content">
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
