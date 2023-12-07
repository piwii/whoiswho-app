import React, {useEffect, useState} from 'react';
import {fakerFR as faker} from '@faker-js/faker'
import Grid from '@mui/system/Unstable_Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './App.css';

function App() {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [propertyToGuess, setPropertyToGuess] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(window.location.href + '/data/byNative.json');
                let data = await response.json()
                setData(data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    function returnToHome() {
        setPropertyToGuess('')
    }

    function launchApp(propertyToGuess) {
        setPropertyToGuess(propertyToGuess)
    }

    if (isLoading) {
        return <div>Is loading</div>
    }

    if (propertyToGuess) {
        return <Game itemList={data.persons} propertyToGuess={propertyToGuess} returnToHome={returnToHome} />
    }
    return <GameMenu availableProperties={data.available_properties} launchApp={launchApp} />
}

function GameMenu(props) {

    return (
        <Grid className="AppContent" container spacing={2}>
            <Grid xs={12} className="AppHeader">
                <h1>Who is Who</h1>
            </Grid>
            <Grid xs={12} className="AppHeader">
                Choisissez une catégorie :
            </Grid>
            <Grid xs={12}>
                <Stack spacing={1}>
                    { props.availableProperties.map((property, index) => {
                        return (
                            <Button key={index} variant="outlined" onClick={() => props.launchApp(property)}>{property}</Button>
                        )
                    })}
                </Stack>
            </Grid>
        </Grid>
    )
}

function GameResult(props) {

    function shareOnWhatApp() {
        const text = "J'ai essayé l'application WhoIsWho pour apprendre à mieux connaitre ses collègues. J'ai eu " + props.score + " bonnes réponses sur le quizz " + props.propertyToGuess + "! Tu veux essayer de me battre : " + window.location.href;
        window.location.href = "whatsapp://send?text=" + text;
    }

    return (
        <Stack spacing={2}>
            <div className="AppMessageEnd">Bravo ! Vous avez obtenu un score de {props.score} / {props.numberOfQuestion}</div>
            <Button variant="contained" color="success" startIcon={<WhatsAppIcon/>} onClick={() => shareOnWhatApp()}>
                Partager
            </Button>
            <Button variant="contained" onClick={() => props.returnToHome()}>
                Retour
            </Button>
        </Stack>
    )
}

function GameCard(props) {
    const [buttonColor, setButtonColor] = useState(new Array(props.nbAnswers).fill("primary"))
    const [answers, setAnswers] = useState([])

    useEffect(() => {
        setButtonColor(new Array(props.nbAnswers).fill("primary"))
        setAnswers(createAnswerList(props.nbAnswers))
    }, [props.item])

    function createAnswerList(nbAnswers)
    {
        let answers = [props.item[props.itemProperty]]
        for (let i = 0; i < nbAnswers - 1; i++) {
            let answer
            do {
                answer = faker.person.firstName(props.item.gender) + ' ' + faker.person.lastName()
                if (props.itemProperty === 'firstname') {
                    answer = faker.person.firstName(props.item.gender)
                } else if (props.itemProperty === 'lastname') {
                    answer = faker.person.lastName(props.item.gender)
                } else if (props.itemProperty === 'job') {
                    answer = faker.person.jobType()
                }
            } while (answers.includes(answer))
            answers.push(answer);
        }
        return answers.sort((a, b) => 0.5 - Math.random())
    }

    function checkAnswer(buttonIndex, answer) {
        const isGood = props.item[props.itemProperty] === answer
        setButtonColor((prevColors) => {
            const updatedColors = [...prevColors];
            updatedColors[buttonIndex] = isGood ? 'success' : 'error';
            return updatedColors;
        });

        setTimeout(function() {
            props.goToNextStep(isGood)
        }, 1000);
    }

    return (
        <Stack spacing={1}>
            <img src={window.location.href + props.item.img} alt='avatar'/>
            { answers.map((answer, index) => {
                return (
                    <Button key={index} variant="outlined" color={buttonColor[index]} onClick={() => checkAnswer(index, answer)}>{answer}</Button>
                )
            })}
        </Stack>
    )
}

function Game(props) {
    const [isEnd, setEnd] = useState(false);
    const [score, setScore] = useState(0);
    const [itemIndex, setItemIndex] = useState(0);

    function goToNextStep(isGoodAnswer) {
        if (isGoodAnswer) {
            setScore(score + 1);
        }

        if (itemIndex === props.itemList.length - 1) {
            setEnd(true);
        } else {
            setItemIndex(itemIndex + 1);
        }
    }

    return (
        <Grid className="AppContent" container spacing={2}>
            <Grid xs={8} className="AppHeader">
                <h1>Who is Who</h1>
            </Grid>
            <Grid xs={4} className="AppHeader">
                Score : {score}
            </Grid>
            <Grid xs={12} className="AppHeader">
                Connaissez vous suffisamment vos collègues ?
            </Grid>
            <Grid className="AppItem" xs={12}>
                {isEnd
                    ? <GameResult score={score} numberOfQuestion={props.itemList.length} propertyToGuess={props.propertyToGuess} returnToHome={props.returnToHome}/>
                    : <GameCard item={props.itemList[itemIndex]} itemProperty={props.propertyToGuess} goToNextStep={goToNextStep} nbAnswers={4}/>
                }
            </Grid>
        </Grid>
    );
}

export default App;
