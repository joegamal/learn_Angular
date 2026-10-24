import { use, useEffect, useState } from 'react'

import './styles/App.css'
import MyButton from "./Components/MyButton.jsx";
import MyButton2 from "./Components/MyButton2.jsx";
import RedComponent from "./Components/ReducerPracticeComponent.jsx";

export default function App() {
  const [count, setCount] = useState(0);

  function increment() { 
    setCount(count + 1);
  }

  const obj = {
    count : count,
    action: increment
  }

  return (
    <>  

      <div>hello</div>

      <MyButton count={count} action={increment}/>
      <MyButton count={count} action={increment}/>
      <MyButton count={count} action={increment}/>

      <MyButton2 obj={obj}/>

      <RedComponent />


    </>
  )
}