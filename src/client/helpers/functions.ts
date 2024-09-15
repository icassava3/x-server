export const encryptQr = (value: string) => {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        result += String.fromCharCode(value.charCodeAt(i) + 10);
    }
    return result;
}
export const decryptQr = (value: string) => {
    let result = "";
    for (let i = 0; i < value.length; i++) {
        result += String.fromCharCode(value.charCodeAt(i) - 10);
    }
    return result;
}

export const  convertirTemps = (secondes: number) => {
    // Tableaux pour stocker les noms des unités de temps
    const unites = ["seconde", "minute", "heure", "jour", "mois"];
    
    // Tableaux pour stocker les ratios de conversion correspondants
    const ratios = [60, 60, 24, 30, 12]; // Secondes -> Minutes -> Heures -> Jours -> Mois
    
    let temps = secondes; // Copie de la valeur initiale
    let i; // Déclaration de la variable i à l'extérieur de la boucle
  
    // Parcourir les ratios de conversion
    for (i = 0; i < ratios.length; i++) {
      const ratio = ratios[i];
      
      // Si le temps est inférieur au ratio actuel, arrête la boucle
      if (temps < ratio) {
        break;
      }
      
      // Divise le temps par le ratio pour passer à l'unité de temps suivante
      temps /= ratio;
    }
  
    // Arrondir le résultat à l'entier le plus proche
    temps = Math.floor(temps);
    
    // Déterminer le nom de l'unité de temps correspondante
    const unite = temps === 1 ? unites[i] : unites[i] + "s";
    
    // Retourner le résultat sous forme de texte
    return `${temps} ${unite}`;
  }
  
  
  // Exemple d'utilisation
//   console.log(convertirTemps(120)); // Résultat : "2 minutes"
//   console.log(convertirTemps(3600)); // Résultat : "1 heure"
//   console.log(convertirTemps(86400)); // Résultat : "1 jour"
//   console.log(convertirTemps(2592000)); // Résultat : "1 mois"
  

// Exemple d'utilisation avec vos données de plages horaires
// const plagesHoraires = [
//   {
//     "heureDebut": "08:00",
//     "heureFin": "11:59",
//     "idPlage": 1
//   },
//   {
//     "heureDebut": "12:00",
//     "heureFin": "17:00",
//     "idPlage": 2
//   },
//   {
//     "heureDebut": "18:00",
//     "heureFin": "20:00",
//     "idPlage": 3
//   }
// ];

// const plagesHorairesNonTriees = [
//   {
//     "heureDebut": "10:00",00
//     "heureFin": "17:00",
//     "idPlage": 2
//   },
//   {
//     "heureDebut": "08:00",
//     "heureFin": "11:59",
//     "idPlage": 1
//   },
//   {
//     "heureDebut": "16:00",
//     "heureFin": "20:00",
//     "idPlage": 3
//   }
// ];

// gererChevauchementPlages(plagesHorairesNonTriees);