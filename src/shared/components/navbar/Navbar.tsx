import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UI, Icons } from '../../../shared';
import { useAuthStore } from '../../../pages';

export const NavBarComponent = () => {

  const { logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const onLogout = () => {
    logoutUser();
    toast.success( 'Sesión cerrada correctamente' );
    navigate( '/' );
  };

  const handleNavigate = ( route: string ) => {
    navigate( route );
  };

  return (
    <UI.Navbar isBlurred maxWidth="full">
      <UI.NavbarContent justify="start">

      </UI.NavbarContent>

      <UI.NavbarContent justify="center">
        <UI.NavbarBrand className="flex flex-col items-center cursor-pointer justify-center h-full py-2" onClick={ () => handleNavigate( '/home' ) }>
          <UI.Image
            src="https://i.imgur.com/bAzCh4h.png"
            alt="Money Icon"
            className="object-contain drop-shadow-lg transition-transform duration-300 hover:scale-110 h-8 w-8"
            width="32"
            height="32"
          />
          <p className="font-bold text-inherit text-lg mt-1">Financiera Buseca</p>
        </UI.NavbarBrand>
      </UI.NavbarContent>

      <UI.NavbarContent justify="end">
        <UI.NavbarItem className="flex">
          <UI.Dropdown>
            <UI.DropdownTrigger>
              <UI.Button aria-label="Menú" startContent={ <Icons.IoMenuOutline size={ 24 } /> } variant="light">
                Menú
              </UI.Button>
            </UI.DropdownTrigger>
            <UI.DropdownMenu aria-label="Static Actions">
              <UI.DropdownItem key="logout" className="text-danger" color="danger" onPress={ onLogout }>
                Cerrar sesión
              </UI.DropdownItem>
            </UI.DropdownMenu>
          </UI.Dropdown>
        </UI.NavbarItem>
      </UI.NavbarContent>
    </UI.Navbar>
  );
};