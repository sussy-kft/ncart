import React from 'react';
import FormMezo from './FormMezo';
import Tabla from './Tabla';

/**
 * Ez az alapértelmezett komponens, ami {@link FormMezo}t, egy címet és egy {@link Tabla}t jelenít meg.
 *
 * @component
 * @param {Object} props - A komponens propsai.
 * @param {Sting} props.cim - Cím, ami megjelenik az oldalon.
 *
 * @returns {React.Element} Az `AlapKomponens`t.
 */
const AlapKomponens = ({ cim }) => (
    <>
      <FormMezo />
      <h1>{cim}</h1>
      <Tabla />
    </>
  );

export default AlapKomponens;