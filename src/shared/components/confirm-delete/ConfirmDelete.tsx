import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icons, UI } from '../ui';


interface Props {
  id: string;
  title: string;
  description: string;
  successMessage: string;
  errorMessage: string;
  onDelete: () => Promise<void>;
}

export const ConfirmDelete: React.FC<Props> = ( {
  title,
  description,
  successMessage,
  errorMessage,
  onDelete,
}: Props ) => {

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const { isOpen, onOpen, onClose } = UI.useDisclosure();

  const confirmDeletion = () => {
    try {
      onDelete();
      onClose();
      toast.success( successMessage );
    } catch ( error: unknown ) {
      console.error( `Error al eliminar ${ title }:`, error );
      toast.error( errorMessage );
    }
  };

  const handleOpenModal = () => {
    onOpen();
  };

  return (
    <>
      <div onClick={ handleOpenModal }>
        <Icons.DeleteDocumentIcon size={ 24 } className={ UI.cn( iconClasses, "text-danger" ) } />
      </div>

      <UI.Modal isOpen={ isOpen } onClose={ onClose } backdrop="blur">
        <UI.ModalContent>

          <UI.ModalHeader className="text-center text-lg font-bold justify-center">{ title }</UI.ModalHeader>

          <UI.ModalBody className="text-center mt-2 text-xl">{ description }</UI.ModalBody>

          <UI.ModalFooter className="flex justify-center mt-4">
            <UI.Button color="default" variant="light" onClick={ onClose } className="mr-2">
              Cancelar
            </UI.Button>
            <UI.Button color="danger" onClick={ confirmDeletion }>
              Sí, borrar
            </UI.Button>
          </UI.ModalFooter>
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};
