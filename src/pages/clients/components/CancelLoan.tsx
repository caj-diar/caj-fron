import { UI, useDisclosure } from '../../../shared';
import { useCancelLoan } from '../../loans/hooks';
import { ILoanByClient } from '../../loans/interfaces/ILoansByClient';


interface Props {
  loan: ILoanByClient;
}

export const CancelLoan = ( { loan }: Props ) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cancelLoan, isPending } = useCancelLoan( loan.id );

  const handleConfirmCancel = () => {
    cancelLoan();
    onOpenChange();
  };

  return (
    <>
      <UI.Button
        color="danger"
        onPress={ onOpen }
        size="sm"
      >
        Cancelar préstamo
      </UI.Button>

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
      >
        <UI.ModalContent>
          { ( onClose ) => (
            <>
              <UI.ModalHeader className="flex flex-col gap-1">
                Confirmar Cancelación de Préstamo
              </UI.ModalHeader>

              <UI.ModalBody>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Está a punto de cancelar el siguiente préstamo:
                  </p>

                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Número de préstamo:</span> { loan.loanNumber }
                    </p>
                    <p>
                      <span className="font-medium">Monto total:</span> ${ loan.totalAmountWithInterest.toLocaleString() }
                    </p>
                    <p>
                      <span className="font-medium">Estado actual:</span> { loan.status }
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      Esta acción cancelará permanentemente el préstamo y no podrá ser revertida.
                    </p>
                  </div>
                </div>
              </UI.ModalBody>

              <UI.ModalFooter>
                <UI.Button
                  color="default"
                  variant="light"
                  onPress={ onClose }
                  className="mr-2"
                >
                  Volver
                </UI.Button>

                <UI.Button
                  color="danger"
                  onPress={ handleConfirmCancel }
                  isLoading={ isPending }
                >
                  Confirmar Cancelación
                </UI.Button>
              </UI.ModalFooter>
            </>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};