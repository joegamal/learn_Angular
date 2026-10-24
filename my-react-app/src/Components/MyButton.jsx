
export default function MyButton({count, action}) {
    return(
        <button onClick={action}>{count}</button>
    )
}