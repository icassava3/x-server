


export const sql_Chp1_b_1=`

`;

export const sql_Chp1_b_2=`

`;
  
export const sql_Chp1_b_3=`
SELECT TypesClasses.RefTypeClasse, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, TypesClasses.Niveau, TypesClasses.Série, [NiveauCourt] & " " & [Série] AS NiveauSérie, Count(Elèves.RefElève) AS EffectGen, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClassé, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClassé, Count(IIf([MOYG1]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG1]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClassé]=0,0,Round([Tranche1]/[EffectClassé],2)) AS Taux1, Count(IIf(IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4]))) Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClassé]=0,0,Round([Tranche2]/[EffectClassé],2)) AS Taux2, Count(IIf(IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4]))) Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClassé]=0,0,Round([Tranche3]/[EffectClassé],2)) AS Taux3, IIf([EffectClassé]<1,Null,Round(Sum(IIf(Not IsNull(IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4])))),IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4]))),0))/[EffectClassé],2)) AS MoyClasse, Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauLong, TypesClasses.filière
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.RefTypeClasse, IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.Niveau, TypesClasses.Série, [NiveauCourt] & " " & [Série], Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauLong, TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Niveaux.RefNiveau;
`;

  
export const sql_Chp1_b_4=`
SELECT TypesClasses.RefTypeClasse, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, TypesClasses.Niveau, TypesClasses.Série, [NiveauCourt] & " " & [Série] AS NiveauSérie, Count(Elèves.RefElève) AS EffectGen, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClassé, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClassé, Count(IIf([MOYG1]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG1]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClassé]=0,0,Round([Tranche1]/[EffectClassé],2)) AS Taux1, Count(IIf(IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4]))) Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClassé]=0,0,Round([Tranche2]/[EffectClassé],2)) AS Taux2, Count(IIf(IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4]))) Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClassé]=0,0,Round([Tranche3]/[EffectClassé],2)) AS Taux3, IIf([EffectClassé]<1,Null,Round(Sum(IIf(Not IsNull(IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4])))),IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=1,[MOYG1],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=2,[MOYG2],IIf([forms]![frmPrincipal]![ChoixTrim_Gen]=3,[MOYG3],[MOYG4]))),0))/[EffectClassé],2)) AS MoyClasse, Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauLong, TypesClasses.filière
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.RefTypeClasse, IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.Niveau, TypesClasses.Série, [NiveauCourt] & " " & [Série], Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauLong, TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Niveaux.RefNiveau;
`;


/*
https://splunktool.com/javascript-sum-and-group-by-of-json-data

JavaScript SUM and GROUP BY of JSON data
*/


// Person array with name and Age
export const SumOfAges  = () => {

// Person array with name and Age
const person = [{
  name: 'Jim',
  color: 'blue',
  age: 22,
  age2: 22,
},
{
  name: 'Sam',
  color: 'blue',
  age: 33,
  age2: 33,
},
{
  name: 'Eddie',
  color: 'green',
  age: 77,
  age2: 76,
},
];

// Add their sum of ages
const sumOfAges = person.reduce((sum, currentValue) => {
return sum + currentValue.age2;
}, 0);

 console.log('sumOfAges ', sumOfAges ); // 132
  return sumOfAges ;
};



// Accepts the array and key
export const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
     // If an array already present for key, push it to the array. Else create an array and push the object
     (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
     );
     // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
     return result;
  }, {}); // empty object is the initial value for result object
};

export const groupSumOf = () => {

  const users = [{
    group: 'editor',
    name: 'Adam',
    age: 23
 },
 {
    group: 'admin',
    name: 'John',
    age: 28
 },
 {
    group: 'editor',
    name: 'William',
    age: 34
 },
 {
    group: 'admin',
    name: 'Oliver',
    age: 28 
   }
 ];

  // Add their sum of labels
  let sumAge = users.reduce((group, age) => {
    group[age.group] = (group[age.group] || 0) + age.age || 1;
    return group;
 }, {})


 console.log('sumAge', sumAge); // sumAge: {editor: 57, admin: 56} 
  return sumAge;
};


export const groupAndAdd = (arr_=null) => {
  const arr = [{
    "quantity": "1",
    "description": "VIP Ticket to Event"
 },
 {
    "quantity": "1",
    "description": "VIP Ticket to Event"
 },
 {
    "quantity": "1",
    "description": "VIP Ticket to Event"
 },
 {
    "quantity": "1",
    "description": "Regular Ticket to Event"
 },
 {
    "quantity": "1",
    "description": "Regular Ticket to Event"
 },
];

  const res = [];
  const this_ = [];
  arr.forEach(el => {
     if (!this_[el.description]) {
        this_[el.description] = {
           description: el.description,
           quantity: 0
        };
        res.push(this_[el.description]);
     };
     this_[el.description].quantity += +el.quantity;
  }, {});
  return res;
}

