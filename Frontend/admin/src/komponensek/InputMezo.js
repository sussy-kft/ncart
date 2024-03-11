import React, { useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';

function InputMezo(props) {
    const { getAll } = useContext(AxiosContext);

    const [opciok, setOpciok] = React.useState([]);
    //const [engedelyek, setEngedelyek] = React.useState([]);

    useState(() => {
        if (props.input?.references !== null && props.input?.references !== undefined)
            getAll(props.input?.references, setOpciok);
    }, [props.input?.references]);

    // useState(() => {
    //     getAll("kezelok/engedelyek", setEngedelyek);
    //     console.log(engedelyek);
    // }, []);

    //console.log(props.input?.dataType.substring(props.input?.dataType.length - 2))

    return props.input?.dataType.substring(props.input?.dataType.length - 2) != "[]" ? (
        <Form.Control
            required={!props.input?.isNullable}
            name={props.input?.columnName ?? ""}
            defaultValue={props.value ?? ""}
            type={typeConverter(props.input?.dataType) ?? ""}
            maxLength={props.input?.characterMaximumLength ?? ""}
            step={"any"}
            min={minConverter(props.input?.dataType) ?? ""}
            max={maxConverter(props.input?.dataType) ?? ""}
            readOnly={props.readOnly ?? false}
            onChange={props.handleChange}
            {...props.input?.references === null ? null : { as: "select" }}>
            {
                props.input === undefined || props.input?.references === null ?
                    null :
                    opciok.map((opcio, index) => {
                        return <option key={index} value={opcio.id}>{opcio.id}</option>
                    })
            }
        </Form.Control>
    ) :
        (
            opciok.map((opcio, index) => {
                return <Form.Check
                    name={props.input?.columnName}
                    key={index}
                    value={opcio}
                    type={"checkbox"}
                    label={opcio}
                    onChange={props.handleChange}
                />
                //<option key={index} value={opcio}>{opcio}</option>
            })

        )
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

function maxConverter(type) {
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

function minConverter(type) {
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