import type { ApplicationListItem } from "../../api";

export type PlacementTree = {
    [key: string]: string[];
};

export type TextKeyPlacementSelectorProps = {
    applications: ApplicationListItem[];
    selectedPlacement: string;
    onSavePlacement: (placement: string) => void;
    onSelectApplication: (applicationId: string) => void;
    textKeyName: string;
};