import { useMemo } from 'react';

export const useFormatDate = () => {
  const formatDate = ( date: Date | string ) => {
    const dateObject = date instanceof Date ? date : new Date( date );

    const utcDate = new Date(
      dateObject.getTime() + dateObject.getTimezoneOffset() * 60 * 1000
    );

    const day = utcDate.getDate().toString().padStart( 2, '0' );
    const month = ( utcDate.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = utcDate.getFullYear();

    return `${ day }/${ month }/${ year }`;
  };

  return useMemo( () => ( {
    formatDate,
  } ), [] );
};