
import type { Application } from "../types";


interface AddApplicationFormModalProps {
    isVisible: boolean; 
    onClose: () => void; 
    onAdd: (application: Application) => void; 
}

const AddApplicationFromModal = ({ isVisible, onClose, onAdd}: AddApplicationFormModalProps) => {

    if (!isVisible) return null; 



 


    return (
        <div>

            
        </div>
    )

}
