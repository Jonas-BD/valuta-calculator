/*  gode ideer og tips:

hvis du vil begrænse antallet af decimaler på dit resultat, så brug methoden toFixed(antal decimaler)  eks.  result.toFixed(2) giver et resultat med 2 decimaler

hvis du vil have navnet på din valuta med fra options i dit select tag, så undersøg denne linje...
 let myCurrency = mySelectElement.options[mySelectElement.selectedIndex].innerText
 prøv evt. at consol logge mySelectElement.options, hvor mySelectElement er det select element du har fundet i din DOM med getElementById()

 */

// Får alle elementer ind på siden
const calcApp = document.getElementById('valutaCalculator');
const calcContainer = document.createElement('div');
calcContainer.className = 'calculatorContainer';
calcApp.appendChild(calcContainer);

const calcHeading = document.createElement('h1');
calcHeading.innerText = 'Valutaomregner';
calcContainer.appendChild(calcHeading);

const belobLabel = document.createElement('label');
belobLabel.setAttribute('for', 'belob');
belobLabel.innerText = 'Indtast beløb i DKK';
calcContainer.appendChild(belobLabel)

const belobInput = document.createElement('input');
belobInput.type = 'tel';
belobInput.id = 'calcBelob';
belobInput.placeholder = 'Beløb i DKK';
calcContainer.appendChild(belobInput);

const valutaLabel = document.createElement('label');
valutaLabel.setAttribute('for', 'valuta');
valutaLabel.innerText = 'Vælg valuta:';
calcContainer.appendChild(valutaLabel);

// En array, hvor man kan vælge valuta kurs
const valutaSelect = document.createElement('select');
valutaSelect.id = 'valuta';
const valutaer = [
    { value: 'Choose', text: 'Vælg valuta kurs' },
    { value: 'EUR', text: 'Euro (EUR)' },
    { value: 'USD', text: 'US Dollar (USD)' },
    { value: 'GBP', text: 'Britiske Pund (GBP)' },
    { value: 'HEJ', text: 'Bare for at se' }
];

// Henter alle valuta kurser, så den kan komme i dropdown menu
valutaer.forEach(valuta => {
    const option = document.createElement('option');
    option.value = valuta.value;
    option.innerText = valuta.text;
    valutaSelect.appendChild(option);
});
calcContainer.appendChild(valutaSelect);

const beregnButton = document.createElement('button');
beregnButton.id = 'beregnValuta';
beregnButton.innerText = 'Beregn';
calcContainer.appendChild(beregnButton);

const calcResultat = document.createElement('div');
calcResultat.id = 'valutaResultat';
calcContainer.appendChild(calcResultat);

// Hent valutakurser fra API'en
async function fetchExchangeRates() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/DKK'); // Henter valuta tallene
    const data = await response.json(); // Får resultaterne fra API'en
    return data.rates; // Henter alle kurser, f.eks. 'EUR', 'USD', 'GBP'
}

// Beregn button, så man får resultatet, når man trykker "Beregn"
beregnButton.addEventListener('click', async function() {
    const belob = parseFloat(belobInput.value); // Henter det beløb, som man har tastet ind
    const valuta = valutaSelect.value; // Henter den valgte valuta fra select-menuen
    
    //Tjekker om der er valgt en valuta, og ikke bare 'choose
    if (valuta === 'Choose') {
        alert('Vælg en, tak!');
        return; // Gør så koden ikke går videre, hvis der er valgt værdien 'choose' (Vælg valuta kurs)
    }

    //Tjekker om beløbet er et gyldigt tal eller større end 0
    if (!isNaN(belob) && belob > 0) {
        // Henter de aktuelle valutakurser (den man har valgt)
        const exchangeRates = await fetchExchangeRates();

        // Tjek om valutaen er en gyldig valuta
        if (exchangeRates[valuta]) {
            const kurs = exchangeRates[valuta]; // Henter den aktuelle kurs for den valgte valuta
            const resultat = (belob * kurs).toFixed(2);
            const valutaNavn = valutaSelect.options[valutaSelect.selectedIndex].innerText; // Henter valuta navn
            calcResultat.innerHTML = `Resultat: ${resultat} <br> Kurs: ${valutaNavn}`;
        } else {
            calcResultat.innerText = 'Valutaen findes ikke i API\'en.';
        }
    } else {
        calcResultat.innerText = 'Indtast venligst et gyldigt beløb.';
    }
});