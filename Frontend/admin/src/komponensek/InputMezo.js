import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';

function InputMezo( { 
    as = 'react.fragment', 
    flag = true, 
    input, 
    isSelect, 
    handleChange, 
    value, 
    pool, 
    name, 
    idk, 
    veryCoolValue, 
    checked 
} ) {
    const { getAll } = useContext(AxiosContext);

    
    const [opciok, setOpciok] = useState([]);
    const [onceFlag, setOnceFlag] = useState(false);

    const As = as ?? 'react.fragment';

    useEffect(() => {
        if (input?.references)
            getAll(input?.references, setOpciok);
    }, [input?.references]);

    useEffect(() => {
        if (input?.references?.split("/").length ==1 || isSelect && handleChange && !onceFlag && (value || opciok[0]?.id || (pool && pool[0]?.[name]))) {
            console.log("kys");
            handleChange({
                target: {
                    name: (name || input?.columnName) ?? "",
                    //ha több időm lenne, akkor nem így csinálnám, de most ez a leggyorsabb megoldás :D
                    //ezért megértem, ha nem tetszik, de most ez van
                    //ez a kód a leggyorsabb megoldás, hogy a selecteket is kezelni tudjuk
                    //ha nem tetszik, akkor kérlek írj egy jobbat
                    
                    //ps. ezért megérte megvenni a copilotot, hogy ilyen commenteket írjon
                    value: idk ? ((input?.references && opciok[0]?.id) ?? (pool && pool[0]?.[name]) ?? value ?? "" ) : (value ?? (input?.references && opciok[0]?.id) ?? (pool && pool[0]?.[name]) ?? "" ),
                    type: typeConverter(input?.dataType) ?? ""
                }
            });
            setOnceFlag(true);
        }
        else if(flag && handleChange && !onceFlag && input?.dataType.substring(input?.dataType.length - 2) == "[]" ){
            handleChange({
                target: {
                    name: (name || input?.columnName) ?? "",
                    type: "checkbox", 
                    checked: checked ? true : false
                }
            });
            setOnceFlag(true);
        }
    }, [value, input, opciok[0]?.id, pool]); 

    if(!input && !value && !opciok[0]) return null;

    return input?.dataType.substring(input?.dataType.length - 2) != "[]" || isSelect ? (
        <As>
            <Form.Control
                as={input?.references || isSelect ? "select" : "input"}
                required={!input?.isNullable}
                name={(name || input?.columnName) ?? ""}
                defaultValue={value ?? ""}
                {...veryCoolValue ? {value: veryCoolValue ?? {}} : {}}
                type={typeConverter(input?.dataType) ?? ""}
                maxLength={input?.characterMaximumLength ?? ""}
                minLength={input?.characterMinimumLength ?? ""}
                step={"any"}
                min={minConverter(input?.dataType) ?? ""}
                max={maxConverter(input?.dataType) ?? ""}
                onChange={handleChange}
                >
                {
                    input?.references ?
                        opciok.map((opcio, index) => {
                            return <option key={index} value={opcio.id}>{opcio.id}</option>
                        })
                        : isSelect ?
                            pool.map((opcio, index) => {
                                return <option key={index} value={opcio[name]}>{opcio[value]}</option>
                            }) : null
                }
            </Form.Control>
        </As>
    )
        : (
            (pool ?? opciok).map((opcio, index) => {
                return <As>
                    <Form.Check
                        name={input?.columnName}
                        key={index}
                        value={opcio}
                        type={"checkbox"}
                        label={opcio}
                        defaultChecked={checked}
                        onChange={handleChange}
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