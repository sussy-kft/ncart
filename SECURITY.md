# Biztonsági Irányelv

## Jelentett sebezhetőségek

Ha sebezhetőséget talál a projektben, kérjük, ne jelentse azt nyilvánosan, hanem írjon nekünk privát üzenetet. Ezt megteheti, például a projekt karbantartójának e-mailben való értesítésével. Miután megkaptuk a jelentést, a következő lépéseket fogjuk tenni:

1. Visszaigazoljuk a jelentést, hogy megerősítsük a sebezhetőséget.
2. Megvizsgáljuk a sebezhetőség súlyosságát és hatását.
3. Javítjuk a sebezhetőséget egy olyan időkeretben, amely megfelel a sebezhetőség súlyosságának.

## Biztonsági Mechanizmusok

Az alkalmazásban a következő biztonsági mechanizmusok vannak:

- Az admin oldalon belépés csak megfelelő email cím és jelszóval lehetséges.
- Az admin oldalon a jelszavakat titkosítjuk.
- A felhasználóknak tokeneket generálunk, amikor belépnek.
- Az alkalmazás rendelkezik egy termékkulccsal, amit a szolgáltatótól lehet igényelni. Ha a backend nem rendelkezik ezzel a kulccsal, az alkalmazás nem működik.

## Támogatott verziók

Jelenleg csak a legújabb verziót támogatjuk, és csak a legújabb verzióban javítjuk a sebezhetőségeket.