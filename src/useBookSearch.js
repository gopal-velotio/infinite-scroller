import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect( () => {
      setBooks([]);
      setLoading(true)
  }, [query])

  useEffect(() => {
    let cancel;
    setLoading(true);
    setError(false);

    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c))
    })
      .then((res) => {
        console.log(res.data);
        setBooks( (prevBooks) => {
            let blist =  [...new Set([...prevBooks, ...res.data.docs.map( b => b.title)])]
            console.log(blist)
            return blist;
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(e);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return {books, loading, error, hasMore};
}
