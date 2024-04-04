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
    const [opciok, setOpciok] = React.useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        // console.log(name, value);
        setAdatok(values => ({ 
                ...values, 
                [name[0].toLowerCase() + name.slice(1)]: value 
            })
        )
    }

    React.useEffect(() => {
        props.handleChange(null);
        if(adatok){
            let xd= []
            props.pool.map(input => {
                xd.push(adatok[input.key])
            })
            getAll(url+"/vonalmegallok/"+xd.join("/"), props.handleChange);
        }
    }, [adatok]);

    React.useEffect(() => {
        const fetchAll = async () => {
            let promises = props.pool.map(input => 
                new Promise((resolve, reject) => {
                    getAll(input.url, (adat) => {
                        // console.log()
                        resolve({ [input.url]: adat });
                    });
                })
            );
    
            let results = await Promise.all(promises);
            let tmp = Object.assign({}, ...results);
            props.pool.map(input => {
                tmp[input.url] = tmp[input.url].filter((v, i, a) => a.map(t => t[input.key]).indexOf(v[input.key]) === i);
            });
                //tmp[key] = tmp[key].filter((v, i, a) => a.map(t => t[key]).indexOf(v[key]) === i);
            
            //array.filter((v, i, a) => a.map(t => t.id).indexOf(v.id) === i);
            //setOpciok(tmp.filter((v, i, a) => a.map(t => t[input.key]).indexOf(v.id) === i));
            setOpciok(tmp);
        };
    
        fetchAll();
    }, [url, axiosId]);

    if (!kulsoAdatok && !opciok) return errorState ? <img src="https://http.cat/503" /> : <img src="https://http.cat/102" />;

    // console.log(props.pool)
    return (
        props.pool.map((input, index) => {
            // console.error(input);
            // console.log(input.value);
            return (
            <Form.Group key={input.value} as={Col} md="6">
                <Form.Label>{input.label+": "}</Form.Label>
                {opciok && <InputMezo key={input.key} name={input.key} input={findKey(input.key)} value={input.value} handleChange={handleChange} isSelect={true} pool={opciok[input.url]}/>}
            </Form.Group>
        )})
    );
}

export default InputSelects;