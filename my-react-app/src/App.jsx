import { use, useEffect, useState } from 'react'

import './styles/App.css'

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


    </>
  )
}

function MyButton({count, action}) {
  return(
    <button onClick={action}>{count}</button>
  )
}

function MyButton2({obj}) {
  return(
    <button onClick={obj.action}>{obj.count}</button>
  )
}

// export default App
