import React, { useState } from 'react'
import Card from './Card'

// import React from 'react';
// import Card from './Card';

// export function GridCards() {
//     let children = Card();
//     const [childCount, setChildCount] = useState(0);

//     const addChild = () => {
//         setChildCount(childCount + 1);
//     }

//     const childComponents = [];
//     for (let i = 1; i <= childCount; i++) {
//         childComponents.push(<Card />);
//     }

//     function addCard() {
//         children += Card();
//         console.log(children);
//         // this.render(children)
//     }

//     return (
//         <div>
//             <button type="button" onClick={addChild} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
//                 Add Card
//             </button>
//             <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
//                 {childComponents}
//             </section>
//         </div>
//     );
// }
// export default GridCards;

class GridCards extends React.Component {
    
    constructor(props) {
        super(props)
        this.state={
            children: []
        }
    }

    addCard() {
        let t = this.state.children
        t.push(<Card />)
        this.setState({children: t})
    }

    render() {
        return (
            <div>
                <button type="button" onClick={ this.addCard.bind(this) } className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Card
                </button>
                <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                    { this.state.children }
                </section>
            </div>
        )
    }
}

export default GridCards