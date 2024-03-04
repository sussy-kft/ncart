import React from 'react';
import { Form, Col } from 'react-bootstrap';

function InputMezo(props) {

    return <Form.Control
        required={props.input.isNullable ? false : true}
        name={props.input.columnName??""}
        defaultValue={props.value??""}
        type={typeConverter(props.input.dataType)??""}
        maxLength={props.input.characterMaximumLength??""}
        step={"any"}
        min={minConverter(props.input.dataType)??""}
        max={maxConverter(props.input.dataType)??""}
        readOnly={props.readOnly??false}
        onChange={props.handleChange} />;
}


function typeConverter(type) {
    switch (type) {
        case "nvarchar":
            return "text";
        case "float":
        case "int":
        case "smallint":
        case "tinyint":
            return "number";
        case "email":
            return "email";
        case "password":
            return "password";
        default:
            return "text";
    }
}

function maxConverter(type){
    switch (type) {
        case "float":
            return 3.4028235e+38
        case "bigint":
            return Number.MAX_SAFE_INTEGER
        case "int":
            return Math.pow(2, 31) - 1
        case "smallint":
            return Math.pow(2, 15) - 1
        case "tinyint":
            return Math.pow(2, 8) - 1
        default:
            return null;
    }
}

function minConverter(type){
    switch (type) {
        case "float":
            return -3.4028235e+38
            case "bigint":
                return Number.MIN_SAFE_INTEGER
            case "int":
                return -Math.pow(2, 31) - 1
            case "smallint":
                return -Math.pow(2, 15) - 1
            case "tinyint":
                return 0
        default:
            return null;
    }
}

export default InputMezo;