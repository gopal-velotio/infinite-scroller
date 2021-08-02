/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import useBookSearch from './useBookSearch';
import { useInView } from 'react-intersection-observer';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { books, loading, error, hasMore } = useBookSearch(query, pageNumber);

  const {ref, inView, entry} = useInView();

  useEffect( () => {
    if(entry && entry.isIntersecting && hasMore) {
      setPageNumber(prevPage => prevPage + 1)
    }
  }, [inView, entry, hasMore]);

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
            <div className="book-item" ref={ref} key={b}>
              {b}
            </div>
          );
        } else {
          return <div className="book-item" key={b}>{b}</div>;
        }
      })}
      <div className="loader">{loading && 'Loading ...'}</div>
      <div>{error && 'error'}</div>
    </div>
  );
}

export default App;
