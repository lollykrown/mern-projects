import React, { useState } from 'react'
import TinderCard from 'react-tinder-card'

const TinderCards = () => {

    const [people, setPeople] = useState([
        {
            name: 'Elon Musk',
            url: 'https://www.biography.com/.image/t_share/MTY2MzU3Nzk2TM2MjMwNTkx/elon-musk-royal-society.jpg'
        },
        {
            name: 'Jeff Bezos',
            url: 'https://www.biography.com/.image/t_share/MTY2NzA3OOE3OTgwMzcyMjYw/jeff-bezos-andrew-harrer_bloomberg-via-getty-images.jpg'
        },
    ])

    const swiped = (dir, nameToDel) => {
        console.log('removing', nameToDel)
    }
    const outOfFrame = (name) => {
        console.log(name, 'left the screen')
    }

    return (
        <div className="tinderCards">
            <div className="tinderCards__cardContainer">
            {people.map(person => (
                <TinderCard  className="swipe"
                key={person.name}
                preventSwipe={["up", "down"]}
                onSwipe={(dir) => swiped(dir, person.name)}
                onCardLeftScreen={() => outOfFrame(person.name)}>
                    <div style={{backgroundImage: `url(${person.url})`}} className="card">
                       <h3>{person.name}</h3> 
                    </div>
                </TinderCard>
            ))}
            </div>
        </div>
    )
}

export default TinderCards
