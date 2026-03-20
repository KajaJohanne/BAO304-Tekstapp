import "./TextKeyCard.css";
import { Card, Heading, Checkbox } from "@digdir/designsystemet-react";
import type { TextKeyCardProps } from "../../types/textKeyCard";

export default function  TextKeyCard({
    textKey,
    checked = false,
    onCheckChange,
    onEdit,
}: TextKeyCardProps) {
    return (
        <div className="text-key-card-row">
            <Card className="text-key-card" data-color="neutral">
                <div className="text-key-card-content">
                    <Heading level={3} data-size="sm" className="text-key-card-title">
                        {textKey.name}
                    </Heading>

                    <button
                        type="button"
                        className="text-key-card-edit-button"
                        onClick={() => onEdit?.(textKey)}
                        aria-label={`Rediger ${textKey.name}`}
                    >
                       ✎ 
                    </button>
                </div>
            </Card>

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
