import React, { Children, useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';

function InputMezo(props) {
    const { getAll } = useContext(AxiosContext);

    
    const flag = props.flag ?? true;
    const [opciok, setOpciok] = React.useState([]);
    const [onceFlag, setOnceFlag] = React.useState(false);

    const As = props.as ?? 'react.fragment';

    useEffect(() => {
        if (props.input?.references)
            getAll(props.input?.references, setOpciok);
    }, [props.input?.references]);

    useEffect(() => {
        if (props.input?.references?.split("/").length ==1 || props.isSelect && props.handleChange && !onceFlag && (props.value || opciok[0]?.id || (props.pool && props.pool[0]?.[props.name]))) {
            console.log("kys");
            props.handleChange({
                target: {
                    name: (props.name || props.input?.columnName) ?? "",
                    //ha több időm lenne, akkor nem így csinálnám, de most ez a leggyorsabb megoldás :D
                    //ezért megértem, ha nem tetszik, de most ez van
                    //ez a kód a leggyorsabb megoldás, hogy a selecteket is kezelni tudjuk
                    //ha nem tetszik, akkor kérlek írj egy jobbat
                    
                    //ps. ezért megérte megvenni a copilotot, hogy ilyen commenteket írjon
                    value: props?.idk ? ((props.input?.references && opciok[0]?.id) ?? (props.pool && props.pool[0]?.[props.name]) ?? props.value ?? "" ) : (props.value ?? (props.input?.references && opciok[0]?.id) ?? (props.pool && props.pool[0]?.[props.name]) ?? "" ),
                    type: typeConverter(props.input?.dataType) ?? ""
                }
            });
            setOnceFlag(true);
        }
        else if(flag && props.handleChange && !onceFlag && props.input?.dataType.substring(props.input?.dataType.length - 2) == "[]" ){
            props.handleChange({
                target: {
                    name: (props.name || props.input?.columnName) ?? "",
                    value: 2 ?? [],
                    type: "checkbox", //typeConverter(props.input?.dataType) ?? "",
                    checked: props.checked ? true : false
                }
            });
            setOnceFlag(true);
        }
    }, [props.value, props.input, opciok[0]?.id, props.pool]); 

    if(!props.input && !props.value && !opciok[0]) return null;

    return props.input?.dataType.substring(props.input?.dataType.length - 2) != "[]" || props.isSelect ? (
        <As>
            <Form.Control
                as={props.input?.references || props.isSelect ? "select" : "input"}
                required={!props.input?.isNullable}
                name={(props.name || props.input?.columnName) ?? ""}
                defaultValue={props.value ?? ""}
                {...props.veryCoolValue ? {value: props.veryCoolValue ?? {}} : {}}
                type={typeConverter(props.input?.dataType) ?? ""}
                maxLength={props.input?.characterMaximumLength ?? ""}
                minLength={props.input?.characterMinimumLength ?? ""}
                step={"any"}
                min={minConverter(props.input?.dataType) ?? ""}
                max={maxConverter(props.input?.dataType) ?? ""}
                onChange={props.handleChange}
                >
                {
                    props.input?.references ?
                        opciok.map((opcio, index) => {
                            return <option key={index} value={opcio.id}>{opcio.id}</option>
                        })
                        : props.isSelect ?
                            props.pool.map((opcio, index) => {
                                return <option key={index} value={opcio[props.name]}>{opcio[props.value]}</option>
                            }) : null
                }
            </Form.Control>
        </As>
    )
        : (
            (props.pool ? props.pool : opciok).map((opcio, index) => {
                return <As>
                    <Form.Check
                        name={props.input?.columnName}
                        key={index}
                        value={opcio}
                        type={"checkbox"}
                        label={opcio}
                        defaultChecked={props.checked}
                        onChange={props.handleChange}
                    />
                </As>
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
        case "time":
            return "time";
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