import { use, useEffect, useState } from 'react'

import Comp from "./comp/Comp"
import './App.css'

export default function App() {

  const [count, setCount]   = useState(0)
  const [count2, setCount2] = useState(0)
  const [count3, setCount3] = useState(0)

  const [c, co] = useEffect(() => console.log("hello from useeffect"))

  return (
    <>  

      <button onClick={()=>setCount(count + 1)} > { count }</button>


      <button onClick= { () => {
        setCount(count + 1)
        setCount2(count2 +1)

      }} > { count2 }</button>

      <button onClick={ () => {
        setCount3(count3 +1)
        setCount(count + 1)
        setCount2(count2 +1)
        } }> { count3 }</button>

     <div>hello </div>

     <Comp/>
    </>
  )
}

// export default App
