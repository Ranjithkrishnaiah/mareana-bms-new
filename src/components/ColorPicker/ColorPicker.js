import React from 'react';
import './Styles.scss';

const ColorPicker = (props) => {
    return (
        <div className="container">
            <input type="color" {...props} />
            <input type="text" {...props} />
        </div>
    );
};

export default ColorPicker;