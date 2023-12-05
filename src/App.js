import React, {useState} from 'react';
import { fakerFR as faker } from '@faker-js/faker'
import Box from '@mui/system/Box';
import Grid from '@mui/system/Unstable_Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './App.css';

function App() {
  const [isEnd, setEnd] = useState(false)
  const [score, setScore] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)

  const itemList = [{
    "firstname": "Romain",
    "lastname": "SINET",
    "fullname": "Romain SINET",
    "gender": "male",
    "img": "/img/avatar/romain_sinet.jpeg",
  }, {
    "firstname": "Sandra",
    "lastname": "FENEYROU",
    "fullname": "Sandra FENEYROU",
    "gender": "female",
    "img": "/img/avatar/sandra_feneyrou.jpeg",
  }]

  const item = itemList[itemIndex];
  const itemSize = itemList.length;

  let answers = [item.fullname]
  for (let i = 0; i < 3; i++) {
    answers.push(faker.person.firstName(item.gender) + ' ' + faker.person.lastName());
  }
  answers = answers.sort((a, b) => 0.5 - Math.random())


  function checkAnswer(goodAnswer, answer) {
    if (goodAnswer === answer) {
      setScore(score + 1)
    }
    if (itemIndex === itemList.length - 1) {
      setEnd(true)
    } else {
      setItemIndex(itemIndex + 1)
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
          { !isEnd ? (
            <Stack spacing={1}>
              <img src={item.img} alt='avatar'/>
              {answers.map((answer, index) => {
                return (
                    <Button key={index} variant="outlined" onClick={() => checkAnswer(item.fullname, answer)}>{answer}</Button>
                )
              })}
            </Stack>
          ) : (
              <div className="AppEnd">Bravo ! Vous avez obtenu un score de {score} / {itemSize}</div>
          ) }
        </Grid>
      </Grid>
  );
}

export default App;
