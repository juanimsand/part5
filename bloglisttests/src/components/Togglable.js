import React, { useState, useImperativeHandle } from 'react'
import './Blog.css'

const Togglable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabelForOpen}</button>
            </div>
            <div style={showWhenVisible} className="classTogglable">
                {props.children}
                <button onClick={toggleVisibility}>{props.buttonLabelForClose}</button>
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'

export default Togglable