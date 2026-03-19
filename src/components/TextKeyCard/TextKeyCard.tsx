import "./TextKeyCard.css";
import type { TextKeyListItem } from "../../../api";
import { Card, Heading, Paragraph, Checkbox } from "@digdir/designsystemet-react";
import type { TextKeyCardProps } from "../../types/textKeyCard";

export default function  TextKeyCard({
    textKey,
    checked = false,
    onCheckChange,
    onEdit,
}: TextKeyCardProps) {
    return (
        <div className="text-key-card-row">
            <Card
                className="text-key-card"
                data-color="neutral"
            >
                <div className="text-key-card-content">
                    <div className="text-key-card-text">
                        <Heading level={3} className="text-key-card-title">
                            {textKey.name}
                        </Heading>

                        <Paragraph className="text-key-card-description">
                            Bokmål: {textKey.default.bokmål}
                        </Paragraph>
                    </div>

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
                    label={`Marker ${textKey.name}`}
                    value={textKey.id}
                />
            </div>
        </div>
    )
}
