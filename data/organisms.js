const TEST_DEFINITIONS = {
  gram_stain: {
    name: "Gram stain",
    alt: "Gram stain image for interpretation"
  },

  blood_agar: {
    name: "Blood agar",
    defaultStatus: "positive",
    defaultResult: "Growth on blood agar with no hemolysis."
  },

  mannitol_salt_agar: {
    name: "Mannitol salt agar",
    defaultStatus: "negative",
    defaultResult: "No growth on Mannitol salt agar."
  },

  macconkey_agar: {
    name: "MacConkey agar",
    defaultStatus: "negative",
    defaultResult: "No growth on MacConkey agar."
  },

  catalase: {
    name: "Catalase test",
    defaultStatus: "negative",
    defaultResult: "Catalase negative. No bubbles are produced after hydrogen peroxide is added."
  },

  citrate: {
    name: "Citrate test",
    defaultStatus: "negative",
    defaultResult: "Citrate negative. The agar stayed green."
  },

  coagulase: {
    name: "Coagulase test",
    defaultStatus: "negative",
    defaultResult: "Coagulase negative."
  },

  indole: {
    name: "Indole test",
    defaultStatus: "negative",
    defaultResult: "Indole test negative."
  },

  oxidase: {
    name: "Oxidase test",
    defaultStatus: "negative",
    defaultResult: "Oxidase negative."
  },

  motility: {
    name: "Motility test",
    defaultStatus: "negative",
    defaultResult: "Non-motile."
  },

  spore_stain: {
    name: "Spore stain",
    defaultStatus: "negative",
    defaultResult: "No spores observed."
  },

  urease: {
    name: "Urease test",
    defaultStatus: "negative",
    defaultResult: "Urease negative. The agar remains yellow."
  }
};


const TEST_ORDER = [
  "gram_stain",
  "blood_agar",
  "mannitol_salt_agar",
  "macconkey_agar",
  "catalase",
  "citrate",
  "coagulase",
  "indole",
  "oxidase",
  "motility",
  "spore_stain",
  "urease"
];

function makeId(name) {
  return name.toLowerCase().replaceAll(" ", "_");
}

function unique(values) {
  return [...new Set(values)];
}

function makeAcceptedAnswers(name, aliases = []) {
  const lowerName = name.toLowerCase();
  const [genus, species] = lowerName.split(" ");
  const firstLetter = genus[0];

  return unique([
    lowerName,
    `${firstLetter} ${species}`,
    `${firstLetter}. ${species}`,
    ...aliases.map(alias => alias.toLowerCase())
  ]);
}

function makeTest(testId, gramImage, positives) {
  const definition = TEST_DEFINITIONS[testId];

  if (testId === "gram_stain") {
    return {
      id: testId,
      name: definition.name,
      image: gramImage,
      alt: definition.alt
    };
  }

  const positiveResult = positives[testId];

  if (positiveResult) {
    return {
      id: testId,
      name: definition.name,
      status: "positive",
      result: positiveResult
    };
  }

  return {
    id: testId,
    name: definition.name,
    status: definition.defaultStatus,
    result: definition.defaultResult
  };
}


function organism({
  name,
  aliases = [],
  difficulty = "beginner",
  gramImage,
  positives = {}
}) {
  return {
    id: makeId(name),
    name,
    acceptedAnswers: makeAcceptedAnswers(name, aliases),
    difficulty,
    tests: TEST_ORDER.map(testId =>
      makeTest(testId, gramImage, positives)
    )
  };
}

const ORGANISMS = [
  organism({
    name: "Staphylococcus aureus",
    aliases: ["staph aureus"],
    gramImage: "images/sau.jpg",
    positives: {
      blood_agar: "Growth on blood agar with beta-hemolysis.",
      mannitol_salt_agar: "Growth on mannitol salt agar. Medium turns yellow.",
      catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
      coagulase: "Coagulase positive. Plasma clot formation is observed.",
      urease: "Urease positive. Agar is bright pink."
    }
  }),

  organism({
    name: "Pseudomonas aeruginosa",
    gramImage: "images/pae.jpg",
    positives: {
      blood_agar: "Growth on blood agar with beta-hemolysis.",
      macconkey_agar: "Colourless colonies on MacConkey agar.",
      catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
      citrate: "Citrate positive. The agar turns blue.",
      oxidase: "Oxidase positive.",
      motility: "The organism is motile."
    }
  }),

  organism({
    name: "Escherichia coli",
    gramImage: "images/eco.jpg",
    positives: {
      macconkey_agar: "Growth on MacConkey agar with pink colonies.",
      catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
      indole: "Indole positive. A red ring forms after Kovac's reagent is added.",
      motility: "The organism is motile."
    }
  }),

  organism({
    name: "Streptococcus pyogenes",
    aliases: [
      "strep pyogenes",
      "group a strep",
      "group a streptococcus"
    ],
    gramImage: "images/spy.jpg",
    positives: {
      blood_agar: "Growth on blood agar with beta-hemolysis."
    }
  }),

  organism({
    name: "Klebsiella pneumoniae",
    gramImage: "images/kpn.jpg",
    positives: {
      macconkey_agar: "Growth on MacConkey agar with pink, mucoid colonies.",
      catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
      citrate: "Citrate positive. The agar turns blue.",
      urease: "Urease positive. The agar turns bright pink."
    }
  }),

  organism({
    name: "Staphylococcus epidermidis",
    aliases: ["staph epidermidis"],
    gramImage: "images/sep.jpg",
    positives: {
      mannitol_salt_agar: "Growth on mannitol salt agar. Medium remains pink or red.",
      catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
      urease: "Urease positive. The agar turns bright pink."
    }
  }),

  organism({
    name: "Proteus mirabilis",
    gramImage: "images/pmi.jpg",
    positives: {
      blood_agar: "Growth on blood agar with no hemolysis. Swarming behaviour.",
      macconkey_agar: "Growth on MacConkey agar with colorless colonies.",
      catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
      citrate: "Citrate positive. The agar turns blue.",
      motility: "The organism has high motility.",
      urease: "Urease positive. The agar turns bright pink."
    }
  }),

  organism({
  name: "Bacillus cereus",
  aliases: ["b cereus", "b. cereus"],
  gramImage: "images/bce.jpg",
  positives: {
    blood_agar: "Growth on blood agar with beta-hemolysis.",
    catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
    motility: "The organism is motile.",
    spore_stain: "Spore stain positive. Endospores are observed."
  }
  }),

  organism({
  name: "Serratia marcescens",
  aliases: ["s marcescens", "s. marcescens"],
  gramImage: "images/sma.jpg",
  positives: {
    macconkey_agar: "Growth on MacConkey agar with pale pink colonies.",
    catalase: "Catalase positive. Bubbles are produced after hydrogen peroxide is added.",
    citrate: "Citrate positive. The agar turns blue.",
    motility: "The organism is motile."
  }
})

];
