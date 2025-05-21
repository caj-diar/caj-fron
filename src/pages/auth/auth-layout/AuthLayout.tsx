import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';


import { UI, useRedirect } from '../../../shared';
import { useAuthStore } from '../store';



export const AuthLayout = () => {

  const { redirectTo } = useRedirect();
  const { status } = useAuthStore();


  useEffect( () => {
    if ( status === 'authorized' ) {
      redirectTo( '/home' );
    }
  }, [ status, redirectTo ] );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,rgba(4,120,87,0.15),transparent_80%)]"></div>
      </div>

      <div className="absolute inset-0 flex justify-center items-start md:items-center z-20 p-3 pt-[200px] md:pt-0">
        <UI.Card className="w-full max-w-md backdrop-blur-sm bg-white/90">
          <UI.CardHeader className="flex justify-center flex-col items-center cursor-pointer" onClick={ () => redirectTo( '/ingresar' ) }>
            <div className="relative w-20 h-20 mb-4">
              <UI.Image
                src="https://i.imgur.com/bAzCh4h.png"
                alt="Money Icon"
                className="object-contain drop-shadow-lg transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-radial from-emerald-200 to-transparent opacity-50 animate-pulse"></div>
            </div>
            <h1 className="font-bold text-inherit text-2xl mt-2 text-emerald-700">Financiera Buseca</h1>
          </UI.CardHeader>

          <UI.CardBody>
            <Outlet />
          </UI.CardBody>
        </UI.Card>
      </div>
    </div>
  );
};
