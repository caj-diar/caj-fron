interface SearchBarProps {
  onSearch: ( term: string ) => void;
  searchTerm: string;
}

export const SearchBar = ( { onSearch, searchTerm }: SearchBarProps ) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={ searchTerm }
        onChange={ ( e ) => onSearch( e.target.value ) }
        placeholder="Buscar transacciones..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
};