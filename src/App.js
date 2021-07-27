import { useCallback, useRef, useState } from 'react';
import useBookSearch from './useBookSearch';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const { books, loading, error, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastElementRef = useCallback( node => {
    console.log(node)
    if(loading) return;
    if(observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPage => prevPage + 1)
      }
    })

    if (node) observer.current.observe(node)

  }, [loading, hasMore]);

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div className='App'>
      <input type='text' onChange={handleSearch} />
      {books.map((b, index) => {
        if (index === books.length - 1) {
          return (
            <div ref={lastElementRef} key={b}>
              {b}
            </div>
          );
        } else {
          return <div key={b}>{b}</div>;
        }
      })}
      <div>{loading && 'Loading ...'}</div>
      <div>{error && 'error'}</div>
    </div>
  );
}

export default App;
