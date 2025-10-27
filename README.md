# Skaičiuotuvas

Tai **paprastas, lengvas ir aiškus projektas**, skirtas parodyti pagrindinį HTML, CSS ir JavaScript sąveikavimą.  

### Funkcijos
- Sudėtis, atimtis, daugyba, dalyba  
- Kėlimo kvadratu ir laipsniu funkcijos
- Galima atlikti daugiau nei du skaičiavimus
- Kvadratinės šaknies ir pasirinkto laipsnio šaknies veiksmai  
- Procentų skaičiavimas  
- Skaičiuotuvo sąsaja pasižymi lanksčiojo dizaino savybėmis (angl. responsive design). Reaguojama į ekrano, lango dydį, orientaciją.
- Rezultatas rodomas dideliais skaičiais, o operacija mažesniais viršuj.
- Del mygtukas kuris trina po vieną simbolį

### Atvejų numatymai
1. **Pradinis būsenos nustatymas** - gavus rezultatą ir pradėjus rašyt naują skaičių ekranas automatiškai išsivalo
2. **Operatorių filtravimas** - neleidžia pradėti rašyti nuo operatoriaus, išskyrus minusą, kad gautųsi neigiamas skaičius
3. **Postfiksinių operatorių saugumas** - %, x², xʸ, ʸ√x veikia tik jei prieš juos yra:
- Skaitmuo (0-9)
- Uždarytas skliaustas )
- Pi π
4. **Skliaustų balansas** 
- Skaičiuoja atidarytus ( ir uždarytus )
- Paspaudus = → uždaro visus likusius skliaustus
5. **Klaidų gaudymas (try-catch)**
- Sintaksės klaidos: 5 + * 3, ((3+))
- Infinity: 5 / 0, 10 / 0
- NaN: √(-4), 0 / 0
- Nebaigtos išraiškos: 5 +


### Apribojimai
Šis skaičiuotuvas **nėra mokslinis** – jis neturi:
- trigonometrijos funkcijų (`sin`, `cos`, `tan`),  
- logaritmų,  
- trupmenų palaikymo ar sudėtingų matematinių operacijų.  

### Dėsniai
- **Artumo dėsnis (Law of Proximity):**  
  Mygtukai ir ekranas išdėstyti grupėmis – skaičiai, veiksmai ir funkcijos atskirti tarpeliais, todėl vartotojas lengvai atpažįsta, kurie elementai priklauso tai pačiai kategorijai.
- **Panašumo dėsnis (Law of Similarity):**  
  Vienodos formos ir dydžio mygtukai suvienodina išvaizdą, o spalvų skirtumai (pvz. violetiniai veiksmai ir pilki skaičiai) padeda greitai atskirti funkcijas.
- (Papildomai) **Tęstinumo principas (Law of Continuity):**  
  Mygtukai išdėstyti tinkleliu, todėl akys natūraliai seka nuo viršaus į apačią, kas padeda išlaikyti aiškią hierarchiją ir tvarką.

<img width="1501" height="1406" alt="Screenshot 2025-10-26 175851" src="https://github.com/user-attachments/assets/0abe9bca-0c13-47ab-adff-ea18aaee5ea3" />
