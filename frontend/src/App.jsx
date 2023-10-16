import React, { useState } from 'react'
import Message from './Message'

function Counter() {
   const [count, setCount] = useState(0)

   const increment = () => {
      setCount(count + 1)
   }

   const decrement = () => {
      setCount(count - 1)
   }

   return (
      <div className="m-2">
         <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src="https://placekitten.com/200/100" />
            <div className="px-6 py-4">
               <div className="font-bold text-xl mb-2">Compteur</div>
               <p className="text-gray-700 text-5xl">
                  {count}
               </p>
            </div>
            <div className="px-6 pt-4 pb-2">
               <button type="button" onClick={increment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Incrémenter
               </button>
               <button type="button" onClick={decrement} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Décrémenter
               </button>
            </div>
         </div>
         <div className="m-2">
          <Message />
      </div>
      </div>

   )
}

export default Counter
