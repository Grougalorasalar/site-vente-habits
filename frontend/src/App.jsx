import React, { useState } from 'react'
import Message from './Message'
import Article from './Article'
import VueArticles from './VueArticles'

function Counter() {
   const [count, setCount] = useState(0)

   const increment = () => {
      setCount(count + 1)
   }

   const decrement = () => {
      setCount(count - 1)
   }

   return (
      <div>
      <div className="m-3 p-3 bg-gray-200 rounded-lg w-1/2 mx-auto text-center text-2xl font-bold text-gray-700 shadow-lg hover:shadow">
         <Article />
      </div>
      </div>
   )
}

export default Counter
