import React from 'react'
import './Mensaje.css'

const Mensaje = (props) => {
    if (props.msj === null) {
        return (
            <div>
                {props.msj}
            </div>)
        //return null;
    }
    else if (props.msjestado === 'p') {
        return (
            <div className="classMensajePos">
                {props.msj}
            </div>
        )
    }
    else if (props.msjestado === 'n') {
        return (
            <div className="classMensajeNeg">
                {props.msj}
            </div>
        )
    }
}

export default Mensaje