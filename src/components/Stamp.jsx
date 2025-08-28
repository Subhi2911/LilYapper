import React from 'react'

const Stamp = ({ avatar, height = 2, width = 2, color = 'black' }) => {
    return (
        <div>
            <div
                style={{
                    height: `${height / 3}rem`,
                    width: `${width}rem`,
                    backgroundColor: "green",
                    position: "absolute",
                    top: '10px',
                    border: '1px solid black'
                }}>
                <div
                    className='d-flex justify-content-center align-items-center'
                    style={{
                        //backgroundColor: "yellow",
                        height: `${height / 4}rem`,
                        width: `${width}rem`,
                        fontSize:'0.7rem',
                        color:'yellow'
                    }}
                >
                    seen
                </div>
            </div>
            {/* <div className='d-flex justify-content-center align-items-center'
                style={{
                    height: `${height}rem`,
                    width: `${width}rem`,
                    borderRadius: '50%',
                    border: `3px solid ${color}`
                }}>
                <div className='d-flex justify-content-center align-items-center'
                    style={{
                        height: `${height - 0.5}rem`,
                        width: `${width - 0.5}rem`,
                        borderRadius: '50%',
                        border: `2px solid ${color}`
                    }}>

                </div> */}

            {/* </div> */}

        </div>
    )
}

export default Stamp

