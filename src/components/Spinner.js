import React from 'react'

const Spinner = () => {
    return (
        <div className='container text-center my-4'>
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Spinner
