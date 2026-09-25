/**
 * Hero guides + patch meta (D10). General game knowledge, not personal data —
 * never add account names, Steam IDs, or links to Dotabuff/OpenDota profiles (D9).
 * Update when a new gameplay patch lands: bump GUIDE_PATCH and add a patch at the top of META.
 */

export type Matchup = { hero: string; why: string };

export type HeroGuide = {
  slug: string;
  name: string;
  abbr: string;
  signature?: boolean;
  role: string;
  attribute: string;
  attack: string;
  playstyle: string;
  items: { early: string[]; core: string[]; situational: string[] };
  strongAgainst: Matchup[];
  weakAgainst: Matchup[];
  timings: string[];
};

export type MetaPatch = {
  patch: string;
  date: string;
  summary: string;
  picks: { hero: string; why: string }[];
};

export const GUIDE_PATCH = '7.41f';

export const HEROES: HeroGuide[] = [
  {
    slug: "phantom-assassin",
    name: "Phantom Assassin",
    abbr: "PA",
    signature: true,
    role: "Carry (pos 1) · Escape · Burst physical damage",
    attribute: "Agility",
    attack: "Melee",
    playstyle: "เลนช่วงแรกใช้ Stifling Dagger ฟาร์มและกดดัน last hit แล้วเร่งฟาร์มด้วย Battle Fury ให้เร็วที่สุด พอได้ Desolator ใช้ Phantom Strike กระโดดเข้าเก็บเป้าหมายตัวบางแล้วคริติคอลจาก Coup de Grace ต้องมี Black King Bar ก่อนเข้าไฟต์ใหญ่",
    items: {
      early: [
        "Quelling Blade",
        "Tango",
        "Iron Branch",
        "Magic Stick",
        "Faerie Fire",
        "Magic Wand",
        "Power Treads"
      ],
      core: [
        "Battle Fury",
        "Desolator",
        "Black King Bar",
        "Abyssal Blade"
      ],
      situational: [
        "Satanic",
        "Nullifier",
        "Butterfly",
        "Manta Style",
        "Aghanim's Scepter",
        "Divine Rapier"
      ]
    },
    strongAgainst: [
      {
        hero: "Witch Doctor",
        why: "ตัวบาง ไม่มีทางหนีเมื่อโดน Phantom Strike"
      },
      {
        hero: "Mirana",
        why: "ตัวบาง โดนคริติคอลไม่กี่ทีก็ตาย"
      },
      {
        hero: "Crystal Maiden",
        why: "ช้าและเลือดน้อย เป็นเป้าเก็บง่าย"
      }
    ],
    weakAgainst: [
      {
        hero: "Lifestealer",
        why: "Rage กันเวทย์และดวลยืนตีได้ดีกว่า"
      },
      {
        hero: "Underlord",
        why: "Pit of Malice ตรึงไว้และ Firestorm เผาต่อเนื่อง"
      },
      {
        hero: "Warlock",
        why: "Fatal Bonds กับ Upheaval และ golem คุมไฟต์ได้"
      }
    ],
    timings: [
      "Level 6: ได้ Coup de Grace เริ่มล่าฮีโร่ตัวบางในเลนได้",
      "Battle Fury ~14-16 นาที: ความเร็วฟาร์มพุ่ง เน้นเก็บป่าและเลนก่อน",
      "Desolator ~19-21 นาที: เริ่มเล่นรุกเก็บ kill และทุบตึก",
      "Black King Bar ~24-26 นาที: พร้อมเข้าไฟต์ใหญ่ ก่อนหน้านั้นอย่าเข้าไฟต์ที่มีคอนโทรลเยอะ"
    ]
  },
  {
    slug: "phantom-lancer",
    name: "Phantom Lancer",
    abbr: "PL",
    role: "Carry (pos 1) · Illusion · Pusher",
    attribute: "Agility",
    attack: "Melee",
    playstyle: "เลนช่วงแรกใช้ Spirit Lance ก่อกวนและ last hit ร่างภาพจาก Juxtapose ช่วยกดดันต่อเนื่อง หลังได้ Manta Style ฟาร์มหลายจุดพร้อมกันได้เร็วมาก เข้าไฟต์ด้วย Phantom Edge ให้ร่างภาพกระจายจนศัตรูหาตัวจริงไม่เจอ",
    items: {
      early: [
        "Quelling Blade",
        "Tango",
        "Iron Branch",
        "Magic Stick",
        "Faerie Fire",
        "Circlet",
        "Wraith Band",
        "Power Treads"
      ],
      core: [
        "Manta Style",
        "Aghanim's Scepter",
        "Eye of Skadi"
      ],
      situational: [
        "Bloodthorn",
        "Heart of Tarrasque",
        "Butterfly",
        "Abyssal Blade",
        "Aghanim's Blessing"
      ]
    },
    strongAgainst: [
      {
        hero: "Slardar",
        why: "ตีทีละเป้า รับมือร่างภาพจำนวนมากไม่ได้"
      },
      {
        hero: "Templar Assassin",
        why: "Refraction หมดชาร์จไปกับร่างภาพ"
      },
      {
        hero: "Drow Ranger",
        why: "ไม่มี AoE และหนีร่างภาพไม่พ้น"
      }
    ],
    weakAgainst: [
      {
        hero: "Necrophos",
        why: "Death Pulse ล้างร่างภาพเป็นวงกว้าง"
      },
      {
        hero: "Gyrocopter",
        why: "Flak Cannon กับ Rocket Barrage ตีร่างภาพหมดทั้งกอง"
      },
      {
        hero: "Bane",
        why: "Fiend's Grip ล็อกตัวจริงไว้นาน"
      }
    ],
    timings: [
      "Level 1-5: ใช้ Spirit Lance กดดันเลน ระวังโดนแก๊งเพราะเลือดน้อย",
      "Manta Style ~15-17 นาที: ฟาร์มพุ่ง แยกร่างภาพไปเก็บเลนและป่าพร้อมกัน",
      "Aghanim's Scepter ~21-23 นาที: เริ่มเข้าไฟต์ได้เต็มรูปแบบ",
      "Eye of Skadi ~28-30 นาที: ร่างภาพทนและตีแรง ช่วง late game เหนือกว่า carry ส่วนใหญ่"
    ]
  },
  {
    slug: "lifestealer",
    name: "Lifestealer",
    abbr: "LS",
    role: "Carry (pos 1) · Durable · Jungler",
    attribute: "Strength",
    attack: "Melee",
    playstyle: "เลนช่วงแรกแข็งแรงเพราะ Feast ดูดเลือด และ Rage กันเวทย์ช่วยเอาตัวรอดจากการแก๊ง ฟาร์มด้วย Radiance แล้วเข้าไฟต์ไวกว่า carry ทั่วไป ใช้ Rage ไล่ตีเป้าหมายหลักและใช้ Infest เข้าเพื่อนเพื่อเข้าหรือหนีไฟต์",
    items: {
      early: [
        "Gauntlets of Strength",
        "Quelling Blade",
        "Iron Branch",
        "Tango",
        "Faerie Fire",
        "Phase Boots"
      ],
      core: [
        "Radiance",
        "Armlet of Mordiggian",
        "Sange and Yasha",
        "Abyssal Blade"
      ],
      situational: [
        "Aghanim's Scepter",
        "Assault Cuirass",
        "Manta Style",
        "Black King Bar",
        "Satanic"
      ]
    },
    strongAgainst: [
      {
        hero: "Phantom Assassin",
        why: "Rage กัน Stifling Dagger และดวลยืนตีชนะ"
      },
      {
        hero: "Muerta",
        why: "Rage กันดาเมจเวทย์จาก Pierce the Veil"
      },
      {
        hero: "Witch Doctor",
        why: "Rage ล้างและกัน Paralyzing Cask กับ Maledict"
      }
    ],
    weakAgainst: [
      {
        hero: "Doom",
        why: "Doom ทะลุ Rage ปิดสกิลและไอเทมทั้งไฟต์"
      },
      {
        hero: "Enigma",
        why: "Black Hole ทะลุ Rage ล็อกไว้กลางไฟต์"
      },
      {
        hero: "Morphling",
        why: "ไหลตัวหนีด้วย Waveform ยิงไกลคุมระยะได้"
      }
    ],
    timings: [
      "Level 1-3: Rage กับ Feast ทำให้แลกเลือดในเลนได้เปรียบ",
      "Radiance ~15-17 นาที: ฟาร์มไวขึ้นและเริ่มกดดันไฟต์เล็ก",
      "Armlet of Mordiggian กับ Sange and Yasha ~20-22 นาที: ช่วงแข็งแกร่งสุด ควรเปิดไฟต์และทุบตึก",
      "7.41f โดน nerf คูลดาวน์ Rage และ Infest ของ Aghanim's Scepter ต้องใช้ Rage ให้คุ้ม ห้ามเปิดเร็วเกินไป"
    ]
  },
  {
    slug: "slark",
    name: "Slark",
    abbr: "",
    role: "Carry (pos 1) · Escape · Skirmisher",
    attribute: "Agility",
    attack: "Melee",
    playstyle: "ช่วงแรกเล่นเลนด้วย Dark Pact ล้างสถานะและ Pounce ล็อกเป้า แล้วสะสม agility จาก Essence Shift ทุกครั้งที่ตี Slark แข็งแกร่งตอนกลางเกม ควรออกหาไฟต์เล็กเร็วด้วย Diffusal Blade เมื่อโดนจับให้ใช้ Shadow Dance หนีหรือฟื้นเลือด",
    items: {
      early: [
        "Circlet",
        "Iron Branch",
        "Faerie Fire",
        "Tango",
        "Quelling Blade",
        "Wraith Band",
        "Power Treads"
      ],
      core: [
        "Diffusal Blade",
        "Aghanim's Scepter",
        "Black King Bar",
        "Disperser"
      ],
      situational: [
        "Mage Slayer",
        "Eye of Skadi",
        "Silver Edge",
        "Skull Basher",
        "Abyssal Blade"
      ]
    },
    strongAgainst: [
      {
        hero: "Sniper",
        why: "ตัวบาง Pounce ล็อกแล้วตายเร็ว"
      },
      {
        hero: "Gyrocopter",
        why: "Essence Shift ขโมย agility ของ carry ฝั่ง agility"
      },
      {
        hero: "Anti-Mage",
        why: "Slark ใช้ mana น้อยและขโมย agility ได้ดวลชนะ"
      }
    ],
    weakAgainst: [
      {
        hero: "Night Stalker",
        why: "Crippling Fear ใบ้และไล่ตามได้ตอนกลางคืน"
      },
      {
        hero: "Clockwerk",
        why: "Power Cogs ขังไว้ Dark Pact หนีไม่ได้"
      },
      {
        hero: "Bloodseeker",
        why: "Rupture ทำให้หนีไม่ได้"
      }
    ],
    timings: [
      "Level 6: ได้ Shadow Dance เริ่มไล่เก็บ kill รอบแมพ",
      "Diffusal Blade ~12-14 นาที: ช่วงรุกแรก เผา mana และไล่ตามเป้าได้ดี",
      "Aghanim's Scepter กับ Black King Bar ~20-24 นาที: ช่วงแข็งแกร่งสุด ควรเล่นไฟต์และจบเกม",
      "ถ้าเกมลากเกิน 35 นาทีจะเสียเปรียบ hard carry ต้องเปิดไฟต์และกด objective เร็ว"
    ]
  },
  {
    slug: "spectre",
    name: "Spectre",
    abbr: "",
    role: "Carry (pos 1) · Durable · Late-game hypercarry",
    attribute: "Agility",
    attack: "Melee",
    playstyle: "ช่วงแรกเล่นเลนแบบปลอดภัยด้วย Spectral Dagger และ Desolate เน้น last hit ให้ได้มากที่สุด หลังได้ Radiance ฟาร์มเร็วและใช้ Haunt โผล่เข้าไฟต์ทั่วแมพ ยิ่งเกมยาว Dispersion ยิ่งทำให้ทนและสะท้อนดาเมจ",
    items: {
      early: [
        "Quelling Blade",
        "Tango",
        "Iron Branch",
        "Magic Stick",
        "Circlet",
        "Power Treads",
        "Urn of Shadows"
      ],
      core: [
        "Radiance",
        "Manta Style",
        "Eye of Skadi",
        "Abyssal Blade"
      ],
      situational: [
        "Black King Bar",
        "Butterfly",
        "Bloodthorn",
        "Nullifier",
        "Aghanim's Scepter",
        "Hand of Midas"
      ]
    },
    strongAgainst: [
      {
        hero: "Windranger",
        why: "Dispersion สะท้อนดาเมจจาก Focus Fire กลับ"
      },
      {
        hero: "Skywrath Mage",
        why: "burst ไม่พอฆ่าและโดน Haunt จับได้ง่าย"
      },
      {
        hero: "Jakiro",
        why: "ตัวช้าตัวบาง เป็นเป้า Haunt ได้ง่าย"
      }
    ],
    weakAgainst: [
      {
        hero: "Doom",
        why: "Doom ปิดสกิลและไอเทมในไฟต์สำคัญ"
      },
      {
        hero: "Undying",
        why: "Decay ขโมย Strength ทำให้ Spectre ไม่ทน"
      },
      {
        hero: "Viper",
        why: "Nethertoxin ปิด passive อย่าง Dispersion และ Desolate"
      }
    ],
    timings: [
      "Level 6: Haunt ช่วยไฟต์ทั่วแมพได้ แต่ช่วงแรกเน้นฟาร์มมากกว่า",
      "Radiance ~16-18 นาที: ฟาร์มพุ่ง และเริ่มใช้ Haunt เข้าไฟต์ได้จริง",
      "Manta Style ~22-24 นาที: ทนและตีแรงพอยืนไฟต์กลาง",
      "Eye of Skadi กับ Abyssal Blade 30+ นาที: ช่วงแข็งแกร่งสุด เกมยิ่งยาวยิ่งได้เปรียบ"
    ]
  },
  {
    slug: "razor",
    name: "Razor",
    abbr: "",
    role: "Carry (pos 1) · Lane dominator · Durable",
    attribute: "Agility",
    attack: "Ranged",
    playstyle: "Razor ครองเลนตั้งแต่ต้นด้วย Static Link ดูดดาเมจศัตรูและ Plasma Field ตีหลายเป้า เล่นรุกตั้งแต่ช่วงแรกเพราะแลกเลือดดีมาก หลังเลเวล 6 ใช้ Eye of the Storm ทุบตึกและตีตอนไฟต์ ควรจบเกมตอนกลางเกมก่อน hard carry จะโต",
    items: {
      early: [
        "Iron Branch",
        "Tango",
        "Circlet",
        "Faerie Fire",
        "Magic Stick",
        "Wraith Band",
        "Power Treads",
        "Falcon Blade"
      ],
      core: [
        "Manta Style",
        "Black King Bar",
        "Satanic"
      ],
      situational: [
        "Sange and Yasha",
        "Butterfly",
        "Linken's Sphere",
        "Blink Dagger",
        "Nullifier",
        "Mage Slayer"
      ]
    },
    strongAgainst: [
      {
        hero: "Medusa",
        why: "Static Link ดูดดาเมจจากคนที่พึ่งการตีธรรมดา"
      },
      {
        hero: "Phantom Assassin",
        why: "Static Link ลดดาเมจของ PA จนดวลไม่ขึ้น"
      },
      {
        hero: "Phantom Lancer",
        why: "Plasma Field กับ Eye of the Storm ตีร่างภาพได้ดี"
      }
    ],
    weakAgainst: [
      {
        hero: "Enchantress",
        why: "Untouchable ลด attack speed และคุมระยะได้"
      },
      {
        hero: "Treant Protector",
        why: "Overgrowth ตรึงไว้และ Living Armor ลดดาเมจ"
      },
      {
        hero: "Phoenix",
        why: "Supernova กับ Sun Ray ทำลายไฟต์ช่วงกลาง"
      }
    ],
    timings: [
      "Level 1-5: Static Link ทำให้แลกเลือดชนะเกือบทุกเลน ควรเล่นรุก",
      "Level 6: Eye of the Storm ทุบตึกและไล่ kill ได้เร็ว",
      "Falcon Blade กับ Manta Style ~15-18 นาที: ช่วงแข็งแกร่งแรก ควรรวมทีมกดตึก",
      "Black King Bar ~22-25 นาที: เข้าไฟต์ใหญ่ได้ พยายามจบเกมก่อน 35 นาที"
    ]
  }
];

/** Newest patch first. */
export const META: MetaPatch[] = [
  {
    patch: "7.41f",
    date: "2026-09-15",
    summary: "แพตช์แรกหลัง TI 2026 เน้น nerf ฮีโร่ยอดนิยม เช่น Shadow Fiend, Lifestealer, Spectre (Desolate ดาเมจลดตอนเลเวลสูง) และขึ้นราคาไอเทม late game พร้อมลด lifesteal ของ Satanic กับ Mask of Madness ส่วน Ursa ได้บัฟ Fury Swipes และ Battle Fury ตัดต้นไม้ได้ถี่ขึ้น",
    picks: [
      {
        hero: "Phantom Lancer",
        why: "win rate สูงสุดกลุ่ม carry ในแรงค์สูง ไม่โดน nerf"
      },
      {
        hero: "Juggernaut",
        why: "win rate pub สูงต่อเนื่อง เล่นง่าย ปลอดภัย"
      },
      {
        hero: "Spectre",
        why: "โดน nerf เล็กน้อยแต่ win rate ยังสูง Haunt ช่วยทีมทั้งแมพ"
      },
      {
        hero: "Slark",
        why: "ถูก pick/ban บ่อยในโปร จบเกมกลางเกมได้ดี"
      },
      {
        hero: "Lone Druid",
        why: "ถูกแบนมากที่สุดในโปรแม้โดน nerf ต่อเนื่อง"
      }
    ]
  },
  {
    patch: "7.41e",
    date: "2026-07-30",
    summary: "แพตช์ปรับก่อน TI ที่ carry meta แทบไม่เปลี่ยน มี nerf Lone Druid, Shadow Fiend และ Spectre เล็กน้อย ไอเทมอย่าง Abyssal Blade, Butterfly, Eye of Skadi, Hand of Midas ได้บัฟ ส่วน Satanic คูลดาวน์นานขึ้น",
    picks: [
      {
        hero: "Ursa",
        why: "win rate pos 1 สูงสุดใน pub"
      },
      {
        hero: "Lone Druid",
        why: "ถูก pick/ban มากที่สุดในโปรช่วง TI"
      },
      {
        hero: "Shadow Fiend",
        why: "ฟาร์มไวและถูกเลือกมากที่สุดก่อนโดน nerf หนักใน 7.41f"
      },
      {
        hero: "Spectre",
        why: "hypercarry ที่ปลอดภัย ฟาร์มฝั่งปลอดภัยแล้ว Haunt เข้าไฟต์"
      },
      {
        hero: "Phantom Lancer",
        why: "ทีมศัตรูไม่มี AoE จะรับมือร่างภาพไม่ไหว"
      }
    ]
  }
];

/** "Phantom Lancer (PL)" → "phantom-lancer" */
export function heroSlug(name: string): string {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Official portrait (256×144) self-hosted in public/img/heroes/<slug>.png — downloaded from
 * Valve's Dota 2 CDN (dota_react/heroes/<internal_name>.png) so visitors don't hit a third party.
 */
export function heroImage(slug: string): string {
  return `/img/heroes/${slug}.png`;
}

export function findHero(slug: string): HeroGuide | undefined {
  return HEROES.find((h) => h.slug === slug);
}
