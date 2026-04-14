import "./ListItemCard.css";
import { Card, Heading } from "@digdir/designsystemet-react";

type ListItemCardProps = {
  title: string;
  isInUse: boolean;
  onClick: () => void;
  onToggleUsage: () => void;
  usageLabelActive?: string;
  usageLabelInactive?: string;
};

export default function ListItemCard({
  title,
  isInUse,
  onClick,
  onToggleUsage,
  usageLabelActive = "Marker som ikke i bruk",
  usageLabelInactive = "Marker som i bruk",
}: ListItemCardProps) {
  return (
    <Card className="list-item-card" data-color="neutral" onClick={onClick}>
      <div className="list-item-card-content">
        <button
          type="button"
          className={`usage-dot ${isInUse ? "usage-dot--active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleUsage();
          }}
          aria-label={isInUse ? usageLabelActive : usageLabelInactive}
        />

        <Heading level={3} data-size="sm" className="list-item-card-title">
          {title}
        </Heading>
      </div>
    </Card>
  );
}
