import { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';

import { UI } from '../../../shared';

interface Props {
  title: string;
  route: string;
  type?: 'clientes' | 'prestamos' | 'caja' | 'cobranza';
  Icon: ElementType;
}

export const CardOptionMenu = ( { title, Icon, route }: Props ) => {
  const navigate = useNavigate();

  const handleNavigate = ( route: string ) => {
    navigate( route );
  };

  return (
    <UI.Card
      isPressable
      className="
        w-40 h-40 m-2 cursor-pointer
        transform transition-all duration-300 ease-in-out
        hover:shadow-md
        overflow-hidden
      "
      onPress={ () => handleNavigate( route ) }
    >
      <UI.CardBody className="
        flex justify-center items-center
        group
        h-[70%]
      ">
        <div className="
          transition-transform duration-300
          group-hover:-translate-y-1
        ">
          <Icon className="
            h-16 w-16
            transition-all duration-300 ease-in-out
            group-hover:scale-110
          "/>
        </div>
      </UI.CardBody>

      <UI.CardFooter className="
        font-bold flex justify-center
        transition-colors duration-300
        group-hover:text-primary
        h-[30%]
        pt-0
      ">
        { title }
      </UI.CardFooter>
    </UI.Card>
  );
};