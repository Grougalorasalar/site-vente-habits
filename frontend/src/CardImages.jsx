import React, { useRef } from 'react'

function CardCarouselItem(props) {
    return (
        <div id={props.currentSlide} className="carousel-item relative w-full">
            <a href={props.articleLink}><img src={props.image} className="w-full rounded-xl" /></a>
            <div className="absolute hidden group-hover:flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <button onClick={() => carouselScroll(props.perviousSlide, props.carouselElement)} className="btn btn-circle">❮</button>
                <button onClick={() => carouselScroll(props.nextSlide, props.carouselElement)} className="btn btn-circle">❯</button>
            </div>
        </div>
    )
}

function carouselScroll(toImage, carouselElement) {
    // Scroll to takes 2 arguments. One is the pixel in the x axis, the second is the pixel in the y axis
    // We take the clientWidth of the carousel element and add 1 pixel to scroll to the given image
    carouselElement.current.scrollTo((carouselElement.current.clientWidth * (toImage)) + 1, 0);
}

function CardImages(props) {

    const carouselElement = useRef(null)

    const addImage = () => {
        const images = [];

        for (let i = 0; i < props.images.length; i++) {
            const key = `carousel-item-${i}`; // Créez une clé unique
            if (i === 0) {
                images.push(
                    <CardCarouselItem
                        key={key}
                        perviousSlide={props.images.length - 1}
                        currentSlide={i}
                        nextSlide={i + 1}
                        image={props.images[i]}
                        carouselElement={carouselElement}
                        articleLink={props.articleLink}
                    />
                );
            } else if (i === props.images.length - 1) {
                images.push(
                    <CardCarouselItem
                        key={key}
                        perviousSlide={i - 1}
                        currentSlide={i}
                        nextSlide={0}
                        image={props.images[i]}
                        carouselElement={carouselElement}
                        articleLink={props.articleLink}
                    />
                );
            } else {
                images.push(
                    <CardCarouselItem
                        key={key}
                        perviousSlide={i - 1}
                        currentSlide={i}
                        nextSlide={i + 1}
                        image={props.images[i]}
                        carouselElement={carouselElement}
                        articleLink={props.articleLink}
                    />
                );
            }
        }

        return images;
    }

    return (props.images.length > 1) ? (
        <div className="carousel w-full" ref={carouselElement} >
            {addImage()}
        </div>
    ) : (
        <figure>
            <img src={props.images} className="w-max" alt={props.unique}
                key={props.key} />
        </figure>
    )
}

export default CardImages
