import React from 'react'

const PlaceHolder = () => {
    return (
        <div style={{ border: "2px solid black", padding: "10px", backgroundColor:"white"}}>
            <div>
                <div >

                    <div className="placeholder-glow">
                        {/* circular avatar placeholder */}
                        <span
                            className="placeholder rounded-circle d-inline-block mx-3"
                            style={{ width: "30px", height: "30px" }}
                        ></span>
                        {/* line placeholder */}
                        <span className="placeholder col-6 mb-2 my-1"></span>

                    </div>
                </div>
                {/* wider line */}
                <span className="placeholder w-75 mb-2 mx-5 my-2"></span>
            </div>
        </div>
    )
}

export default PlaceHolder
