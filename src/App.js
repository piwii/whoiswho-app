import React, {useEffect, useState} from 'react';
import {fakerFR as faker} from '@faker-js/faker'
import Grid from '@mui/system/Unstable_Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './App.css';

function App() {
    const [isLoading, setLoading] = useState(true)
    const [itemList, setItemList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(window.location.href + '/data/byNative.json');
                let data = await response.json()
                setItemList(data.persons)


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div>Is loading</div>
    }

    return <Game itemList={itemList} />
}

function Game(props) {
    const [isEnd, setEnd] = useState(false)
    const [score, setScore] = useState(0)
    const [itemIndex, setItemIndex] = useState(0)

    const item = props.itemList[itemIndex];

    let answers = [item.fullname]
    for (let i = 0; i < 3; i++) {
        answers.push(faker.person.firstName(item.gender) + ' ' + faker.person.lastName());
    }
    answers = answers.sort((a, b) => 0.5 - Math.random())

    function checkAnswer(goodAnswer, answer) {
        if (goodAnswer === answer) {
            setScore(score + 1)
        }
        if (itemIndex === props.itemList.length - 1) {
            setEnd(true)
        } else {
            setItemIndex(itemIndex + 1)
        }
    }

    function shareOnWhatApp() {
        const text = "J'ai eu " + score + " bonnes réponses ! Tu veux essayer : " + window.location.href;
        window.location.href = "whatsapp://send?text=" + text;
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
                    {!isEnd ? (
                        <Stack spacing={1}>
                            <img src={item.img} alt='avatar'/>
                            {answers.map((answer, index) => {
                                return (
                                    <Button key={index} variant="outlined"
                                            onClick={() => checkAnswer(item.fullname, answer)}>{answer}</Button>
                                )
                            })}
                        </Stack>
                    ) : (
                        <Stack spacing={20} pt={18}>
                            <div className="AppEnd">Bravo ! Vous avez obtenu un score de {score} / {props.itemList.length}</div>
                            <Button variant="outlined" startIcon={<WhatsAppIcon/>} onClick={() => shareOnWhatApp()}>
                                Partager
                            </Button>
                        </Stack>
                    )}
                </Grid>
        </Grid>
    );
}

export default App;
