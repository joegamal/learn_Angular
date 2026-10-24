

export default function MyButton2({obj}) {
    return(
        <button onClick={obj.action}>{obj.count}</button>
    )
}