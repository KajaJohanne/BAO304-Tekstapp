import { TextKeyListItem } from "../../api"

export type TextKeyCardProps = {
    textKey: TextKeyListItem;
    checked?: boolean;
    onCheckChange?: (checked: boolean) => void;
    onEdit?: (textKey: TextKeyListItem) => void;
};