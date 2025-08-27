import React from 'react'

const Spinner = ({color}) => {
    return (
        <div className='container text-center my-4'>
            <div className="spinner-border " style={{color: color}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
