var Variables = {
    targetPoint: 0,
    totalPoints: 0,
    shotSound: null,
    failSound: null,
    maxnoOfballsthrowable: 8,
    pointPerCharacter: "+50",
    pointPerFailedCharacter: "-15",
    words: ["disproportionateness","counterdemonstration","internationalization",
            "immunohistochemistry","counterrevolutionist","indistinguishability",
            "overenthusiastically","uncharacteristically","antiestablishmentism",
            "magnetohyrodynamics"],
    word: "",
    apiBase: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
    "http://localhost:3001/api/" : "https://wordshot.herokuapp.com/api/",
};
export default Variables;