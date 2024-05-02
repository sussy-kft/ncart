import { render } from '@testing-library/react';
import { AxiosContext, AxiosProvider } from '../context/Alap/AxiosContext';
import axios from 'axios';
import { InfoPanelContext } from '../context/Alap/InfoPanelContext';
import MockAdapter from 'axios-mock-adapter';

let mock = new MockAdapter(axios);

mock.onGet('https://localhost:44339/test').reply(200, 'xd');
mock.onPost('https://localhost:44339/test').reply(200, 'xd');
mock.onPut('https://localhost:44339/test').reply(200, 'xd');
mock.onPatch('https://localhost:44339/test').reply(200, 'xd');
mock.onDelete('https://localhost:44339/test').reply(200, 'xd');

/**
 * @module AxiosContext.test
 * @description Ez a fájl teszteket tartalmaz az AxiosProvider és AxiosContext komponensekhez.
 * 
 * Az axios csomagot nem mockoljuk, helyette a MockAdapter segítségével beállítjuk a válaszokat a különböző HTTP metódusokra.
 * 
 * Az AxiosProvider tesztek során ellenőrizzük, hogy a szükséges függvények (getAll, post, put, patch, destroy) léteznek-e.
 * Ehhez a render függvény segítségével rendereljük az AxiosProvider komponenst, majd az AxiosContext.Consumer komponensen keresztül elérjük a context értékeit.
 * 
 * Az Axios csomag tesztjei során ellenőrizzük, hogy a különböző HTTP metódusok (get, post, put, patch, delete) működnek-e.
 * Ehhez az axios csomag megfelelő metódusait hívjuk meg, majd ellenőrizzük, hogy a válasz adata megegyezik-e az elvárt értékkel.
 */
describe('AxiosProvider', () => {
    it('A getAll függvény létezik-e', async () => {

    const mockAddInfoPanel = jest.fn();
    const mockInfoPanelContext = {
      addInfoPanel: mockAddInfoPanel,
    };

    let contextValues;
    render(
      <InfoPanelContext.Provider value={mockInfoPanelContext}>
        <AxiosProvider>
          <AxiosContext.Consumer>
            {context => {
              contextValues = context;
              return null;
            }}
          </AxiosContext.Consumer>
        </AxiosProvider>
      </InfoPanelContext.Provider>
    );
        expect(contextValues.getAll).toBeDefined();
    });
})

describe('AxiosProvider', () => {
    it('A post függvény létezik-e', async () => {

    const mockAddInfoPanel = jest.fn();
    const mockInfoPanelContext = {
      addInfoPanel: mockAddInfoPanel,
    };

    let contextValues;
    render(
      <InfoPanelContext.Provider value={mockInfoPanelContext}>
        <AxiosProvider>
          <AxiosContext.Consumer>
            {context => {
              contextValues = context;
              return null;
            }}
          </AxiosContext.Consumer>
        </AxiosProvider>
      </InfoPanelContext.Provider>
    );
        expect(contextValues.post).toBeDefined();
    });
})

describe('AxiosProvider', () => {
    it('A put függvény létezik-e', async () => {

    const mockAddInfoPanel = jest.fn();
    const mockInfoPanelContext = {
      addInfoPanel: mockAddInfoPanel,
    };

    let contextValues;
    render(
      <InfoPanelContext.Provider value={mockInfoPanelContext}>
        <AxiosProvider>
          <AxiosContext.Consumer>
            {context => {
              contextValues = context;
              return null;
            }}
          </AxiosContext.Consumer>
        </AxiosProvider>
      </InfoPanelContext.Provider>
    );
        expect(contextValues.put).toBeDefined();
    });
})

describe('AxiosProvider', () => {
    it('A patch függvény létezik-e', async () => {

    const mockAddInfoPanel = jest.fn();
    const mockInfoPanelContext = {
      addInfoPanel: mockAddInfoPanel,
    };

    let contextValues;
    render(
      <InfoPanelContext.Provider value={mockInfoPanelContext}>
        <AxiosProvider>
          <AxiosContext.Consumer>
            {context => {
              contextValues = context;
              return null;
            }}
          </AxiosContext.Consumer>
        </AxiosProvider>
      </InfoPanelContext.Provider>
    );
        expect(contextValues.patch).toBeDefined();
    });
})

describe('AxiosProvider', () => {
    it('A destroy függvény létezik-e', async () => {

    const mockAddInfoPanel = jest.fn();
    const mockInfoPanelContext = {
      addInfoPanel: mockAddInfoPanel,
    };

    let contextValues;
    render(
      <InfoPanelContext.Provider value={mockInfoPanelContext}>
        <AxiosProvider>
          <AxiosContext.Consumer>
            {context => {
              contextValues = context;
              return null;
            }}
          </AxiosContext.Consumer>
        </AxiosProvider>
      </InfoPanelContext.Provider>
    );
        expect(contextValues.destroy).toBeDefined();
    });
})


describe('AxiosProvider', () => {
  it('A hasznalt Axios get csomag mukodik-e', async () => { 
    const response = await axios.get('https://localhost:44339/test');
    expect(response.data).toBe("xd");
    });
})

describe('AxiosProvider', () => {
    it('A hasznalt Axios post csomag mukodik-e', async () => {
        const response2 = await axios.post('https://localhost:44339/test');
        expect(response2.data).toBe("xd");
    });
})

describe('AxiosProvider', () => {
    it('A hasznalt Axios put csomag mukodik-e', async () => {
        const response2 = await axios.put('https://localhost:44339/test');
        expect(response2.data).toBe("xd");
    });
})

describe('AxiosProvider', () => {
    it('A hasznalt Axios patch csomag mukodik-e', async () => {
        const response2 = await axios.patch('https://localhost:44339/test');
        expect(response2.data).toBe("xd");
    });
})

describe('AxiosProvider', () => {
    it('A hasznalt Axios delete csomag mukodik-e', async () => {
        const response2 = await axios.delete('https://localhost:44339/test');
        expect(response2.data).toBe("xd");
    });
})