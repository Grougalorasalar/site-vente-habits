import React, { useEffect, useState } from 'react';
import Article from './Article';

function VueArticles() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch('/api/articles')
            .then((response) => response.json())
            .then((data) => setArticles(data['hydra:member']));
    }
    , []);

  return (
    <div>
      <h1>Vue Articles</h1>
      <div class="grid grid-cols-3 gap-20">
        <div>01</div>
        <div>02</div>
        <div>03</div>
        <div>04</div>
        <div>05</div>
        <div>06</div>
        </div>
    </div>
  );
}

export default VueArticles;
