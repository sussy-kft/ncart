import React from 'react';
import Form from 'react-bootstrap/Form';
import { useContext } from 'react';
import { AxiosContext } from '../../context/AxiosContext';
import { MetaadatContext } from '../../context/MetaadatContext';
import Col from 'react-bootstrap/Col';
import InputMezo from '../InputMezo';

function InputSelects(props){

    const { axiosId, errorState, getAll } = useContext(AxiosContext);
    const { url, getPKs, findKey, metaadat, kulsoAdatok } = useContext(MetaadatContext);

    const [adatok, setAdatok] = React.useState(null);

    React.useEffect(() => {
        const fetchAll = async () => {
            let promises = props.pool.map(input => 
                new Promise((resolve, reject) => {
                    getAll(input.url, (adat) => {
                        resolve({ [input.url]: adat });
                    });
                })
            );
    
            let results = await Promise.all(promises);
            let tmp = Object.assign({}, ...results);
            setAdatok(tmp);
        };
    
        fetchAll();
    }, [url, axiosId]);

    if (!kulsoAdatok && !adatok) return errorState ? <img src="https://http.cat/503" /> : <img src="https://http.cat/102" />;

    // console.log(props.pool)
    return (
        props.pool.map((input, index) => {
            // console.error(input);
            // console.log(adatok[input.url]);
            return (
            <Form.Group key={input.value} as={Col} md="6">
                <Form.Label>{input.label+": "}</Form.Label>
                {adatok && <InputMezo key={input.key} input={findKey(input.key)} value={input.value} isSelect={true} pool={adatok[input.url]}/>}
            </Form.Group>
        )})
    );
}

export default InputSelects;