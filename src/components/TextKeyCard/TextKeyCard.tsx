import "./TextKeyCard.css";
import { Card, Heading, Checkbox } from "@digdir/designsystemet-react";
import type { TextKeyCardProps } from "../../types/textKeyCard";

export default function TextKeyCard({
  textKey,
  checked = false,
  onCheckChange,
  onEdit,
  isInUse = false,
  onToggleUsage,
}: TextKeyCardProps) {
  return (
    //List over tekstnøkler
    <div className="text-key-card-row">
      <Card.Block
        className="text-key-card"
        data-color="neutral"
        onClick={() => onEdit?.(textKey)}
      >
        <div className="text-key-card-content">
          <button
            type="button"
            className={`usage-dot ${isInUse ? "usage-dot--active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleUsage?.();
            }}
            aria-label={
              isInUse ? "Marker som ikke i bruk" : "Marker som i bruk"
            }
          />

          <Heading level={3} data-size="sm" className="text-key-card-title">
            {textKey.name}
          </Heading>

          <button
            type="button"
            className="text-key-card-edit-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(textKey);
            }}
            aria-label={`Rediger ${textKey.name}`}
          >
            ✎
          </button>
        </div>
      </Card.Block>

      {/* Markeringsbokser */}
      <div className="text-key-card-checkbox-wrapper">
        <Checkbox
          checked={checked}
          onChange={(e) => onCheckChange?.(e.target.checked)}
          label=" "
          value={textKey.id}
        />
      </div>
    </div>
  );
}
