/* The ten social cards, as data. card.html draws one, og.js shoots all of
   them. Loaded by both, so the list lives in one place.

   Keep the copy here in step with the page it belongs to: the eyebrow, the
   headline and the meta line should be the ones a visitor actually reads. */

(function (root) {
  var GOLD = "#C9962C", MAROON = "#8C1C2F", MAROON_2 = "#AE2739", DEEP = "#45101C";
  var INK = "#1E1013";

  var CARDS = [
    { file: "home.png",
      eyebrow: "By Hamcodes",
      headline: "Code with confidence. Stay safe online.",
      meta: "books.hamcodes.com",
      bot: true },

    { file: "books.png",
      eyebrow: "Hamcodes / Books",
      headline: "The Hamcodes Book Series",
      meta: "Coding, robotics and the teacher's edition" },

    { file: "coding-for-kids.png",
      eyebrow: "My First Code",
      headline: "Coding for Kids",
      meta: "Ages 5+ · From Scratch to friendly bots",
      cover: { fill: GOLD, ink: INK, label: "Coding for Kids" } },

    { file: "coding-for-teens.png",
      eyebrow: "My First Code",
      headline: "Coding for Teens",
      meta: "Ages 9+ · Real projects, deeper logic",
      cover: { fill: MAROON_2, label: "Coding for Teens" } },

    { file: "build-a-bot.png",
      eyebrow: "Robotics · STEAM",
      headline: "Build-A-Bot",
      meta: "Ages 7 to 15 · 3D design, coding, Arduino",
      cover: { fill: MAROON, label: "Build-A-Bot" } },

    { file: "teachers-edition.png",
      eyebrow: "Coding for Educators",
      headline: "Teacher's Edition",
      meta: "For teachers · Never coded before? Teach it anyway",
      cover: { fill: DEEP, label: "Teacher's Edition" } },

    { file: "bro.png",
      eyebrow: "Bro 2 Bro · Free to read",
      headline: "Bro, nobody told me.",
      meta: "62 notes on life after school" },

    { file: "blog.png",
      eyebrow: "From the Hamcodes blog",
      headline: "Read up before you teach it.",
      meta: "54 articles · Netizenship, coding, money" },

    { file: "resources.png",
      eyebrow: "Free · No sign-up",
      headline: "The Digital Netizenship Workbook.",
      meta: "Workbook + 5 worksheets · Print and teach" },

    { file: "mentorship.png",
      eyebrow: "Private Tech Mentorship",
      headline: "One-on-one guidance for young coders.",
      meta: "Ages 8 to 16 · 5 spots · By application" },
  ];

  if (typeof module === "object" && module.exports) module.exports = CARDS;
  else root.OG_CARDS = CARDS;
})(typeof window !== "undefined" ? window : this);
