import { useEffect, useState } from "react"

export default function Button ({children, mode, className, id, onClick}) {

    const [style, setStyle] = useState({
        color: '', backgroundColor: ''
    })

    useEffect(()=>{
        if (mode === "light") {
            setStyle({
                color: 'var(--dark)', backgroundColor: 'var(--white)'
            })
        } else if (mode === "dark") {
            setStyle({
                color: 'var(--white)', backgroundColor: 'var(--dark)'
            })
        } else if (mode === "light-red") {
            setStyle({
                color: 'var(--red)', backgroundColor: 'var(--white)'
            })
        } else if (mode === "red") {
            setStyle({
                color: 'var(--white)', backgroundColor: 'var(--red)'
            })
        }
    }, [mode])

    return (
        <div className={`Button ${className}`} id={id} style={style} onClick={onClick}>
            {children}
        </div>  
    )
}