import { DarkModeProvider } from "../context/Alap/DarkModeContext";
import { AxiosProvider } from "../context/Alap/AxiosContext";
import { MetaadatProvider } from "../context/Alap/MetaadatContext";
import { InfoPanelProvider } from "../context/Alap/InfoPanelContext";

/**
 * Egy komponens, ami a gyereket az alábbi context providerekkel látja el:
 * 
 * ඞ {@link InfoPanelProvider}
 * 
 * ඞ {@link DarkModeProvider}
 * 
 * ඞ {@link AxiosProvider}
 * 
 * ඞ {@link MetaadatProvider}
 * 
 * @returns {React.Component} A gyerek komponenst, ami providerekkel van beágyazva.
 */
function Providerek({children}){
    return(
      <InfoPanelProvider>
        <DarkModeProvider>
            <AxiosProvider>
            <MetaadatProvider>
                {children}
            </MetaadatProvider>
            </AxiosProvider>
        </DarkModeProvider>
      </InfoPanelProvider>
    )
}

export default Providerek;