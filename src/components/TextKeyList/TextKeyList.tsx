import "./TextKeyList.css";
import { Card, Heading } from "@digdir/designsystemet-react";
import type { Props } from "../../types/textKeyList";

export default function TextKeyList({
  textKey,
  onClick,
  onToggleUsage,
}: Props) {
  return (
    <Card className="text-key-card" data-color="neutral" onClick={onClick}>
      <div className="text-key-card-content">
        <button
          className={`usage-dot ${textKey.isInUse ? "usage-dot--active" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // gjør at ikke kortet åpner seg når man trykker på prikken
            onToggleUsage();
          }}
          aria-label={
            textKey.isInUse
              ? "Marker tekstnøkkel som ikke i bruk"
              : "Marker tekstnøkkel som i bruk"
          }
        />

        <Heading level={3} data-size="sm" className="text-key-card-title">
          {textKey.name}
        </Heading>

        <button
          type="button"
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation(); //Så ikke hele kortet trigger
          }}
        >
          ✎
        </button>
      </div>
    </Card>
  );
}
