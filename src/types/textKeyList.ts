import type { TextKeyListItem } from "../../api"

export type Props = {
    textKey: TextKeyListItem;
    onClick?: () => void;
    onToggleUsage: () => void;
};
