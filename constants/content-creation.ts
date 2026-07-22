/**
 * The Creation (Genesis 1–3) — Tier 1, the one `ready` item in the library (§5.2).
 *
 * The abridged script, carried over verbatim. It is reading-level tuned, so nothing here
 * is rewritten, simplified, or padded — each `s('...')` is a line of the source script
 * exactly as written, and `s()` (see `creation-words.ts`) attaches each word's phonemes
 * from the shared lexicon.
 *
 * ## Pages
 * A bolded word in the source marks the start of a page; the paragraphs that follow,
 * until the next bolded word, belong to that same page under one illustration. That
 * yields 14 pages and 53 sentences.
 *
 * ## Sentences
 * One sentence per terminal mark, except that a quotation and the attribution naming its
 * speaker stay together as a single card — `"Adam! Eve! Where are you?" called God.` reads
 * as one beat, not three. A quoted passage with no attribution splits normally.
 *
 * ## Illustrations
 * None exist yet. Each page's `artBrief` describes the scene for the designer and doubles
 * as the on-screen placeholder until the art lands; adding the file to `PAGE_ART` in
 * `content.ts` under the page's `background` key is the only change needed then.
 */
import type { StoryContent } from '@/constants/content';
import { s } from '@/constants/creation-words';

export const CREATION: StoryContent = {
  id: 'creation',
  type: 'story',
  category: 'bibleStories',
  title: 'The Creation',
  tier: 1,
  phonicsFocus: ['cvc', 'sight-words'],
  skills: ['pronunciation', 'comprehension'],
  thumbnail: '#8ECAE6',
  order: 0,
  status: 'ready',

  // Page backgrounds are illustration asset keys, so the quiz names its own scene rather
  // than falling through `getSceneBackground`'s default.
  quizBackground: 'creation-sky-field',

  pages: [
    {
      id: 'creation-p1',
      background: 'creation-p1.png',
      artBrief:
        'A wide, sunlit view of the whole world — rolling green hills, blue ocean, soft ' +
        'clouds. Warm and inviting, the opening shot of a big beautiful place.',
      sentences: [
        s('The world is a big place.'),
        s('God made everything in it!'),
        s("Let's see what God made, day by day."),
      ],
    },
    {
      id: 'creation-p2',
      background: 'creation-p2.png',
      artBrief:
        'A sky split between glowing golden daylight and deep blue night with stars. ' +
        'Warm light breaking across darkness; calm and awe-filled.',
      sentences: [s('Day one: God made light.'), s('He made day and night.')],
    },
    {
      id: 'creation-p3',
      background: 'creation-p3.png',
      artBrief:
        'A bright blue sky above a vast open ocean, gentle waves catching the light. ' +
        'Spacious and fresh.',
      sentences: [s('Day two: God made the sky.'), s('He made the big blue ocean too.')],
    },
    {
      id: 'creation-p4',
      background: 'creation-p4.png',
      artBrief:
        'Green land rising out of the water — mountains, rolling hills, and dry golden ' +
        'ground. Solid and majestic.',
      sentences: [s('Day three: God made the land.'), s('Mountains, hills, and dry ground!')],
    },
    {
      id: 'creation-p5',
      background: 'creation-p5.png',
      artBrief:
        'A warm sun on one side, a crescent moon and scattered stars on the other, over a ' +
        'quiet landscape. Peaceful, day meeting night.',
      sentences: [s('Day four: God made the sun.'), s('He made the moon and all the stars.')],
    },
    {
      id: 'creation-p6',
      background: 'creation-p6.png',
      artBrief:
        'Colorful fish splashing in clear water while birds wheel through the sky above. ' +
        'Lively and playful, full of movement.',
      sentences: [
        s('Day five: God made the fish.'),
        s('He made the birds too.'),
        s('Splash and flap!'),
      ],
    },
    {
      id: 'creation-p7',
      background: 'creation-p7.png',
      artBrief:
        'A meadow full of friendly animals — lions, rabbits, elephants, deer — with Adam ' +
        'and Eve standing together among them, bathed in golden light. Joyful and welcoming.',
      sentences: [
        s('Day six: God made all the animals.'),
        s('Then God made people.'),
        s('He made them just like Him.'),
      ],
    },
    {
      id: 'creation-p8',
      background: 'creation-p8.png',
      artBrief:
        'A still, glowing landscape at rest with everything from the previous days ' +
        'visible, softly lit. Quiet, restful, contented.',
      sentences: [s('Day seven: God rested.'), s('He looked at His big, beautiful world.')],
    },
    {
      id: 'creation-p9',
      background: 'creation-p9.png',
      artBrief:
        'Adam and Eve in the lush garden of Eden — fruit trees, flowers, a gentle stream ' +
        '— with warm golden light overhead. Happy and abundant.',
      sentences: [
        s('God made the first two people.'),
        s('Their names were Adam and Eve.'),
        s('They lived in a garden called Eden.'),
        s('It was a happy place.'),
        s('"This world is for you," God said.'),
        s('"Have a family.'),
        s('Go everywhere!'),
        s('Name all the animals."'),
      ],
    },
    {
      id: 'creation-p10',
      background: 'creation-p10.png',
      artBrief:
        'The snake coiled on a branch of a fruit tree, leaning toward a hesitant Eve while ' +
        'Adam stands nearby. Bright colors but a subtly uneasy mood; the snake looks sly.',
      sentences: [
        s('Adam and Eve were happy in the garden.'),
        s('But one day, a sneaky snake came along.'),
        s('"S-see that fruit?" said the snake.'),
        s('"Take a bite.'),
        s('It\'s yummy."'),
        s('"God said not to eat that," said Eve.'),
        s('"Are you s-sure?" said the snake.'),
        s('"Eat it, and you\'ll be just like God."'),
      ],
    },
    {
      id: 'creation-p11',
      background: 'creation-p11.png',
      artBrief:
        "Eve holding the bitten fruit, Adam taking it from her. The garden's colors just " +
        'slightly cooler and dimmer. A quiet turning point.',
      sentences: [s('The snake tricked Eve.'), s('She ate the fruit.'), s('Adam ate it too.')],
    },
    {
      id: 'creation-p12',
      background: 'creation-p12.png',
      artBrief:
        'Adam and Eve crouched behind a large leafy bush, hiding, looking worried. ' +
        'Shadows lengthening across the garden.',
      sentences: [
        s('Uh oh.'),
        s('Adam and Eve knew they did something wrong.'),
        s('They hid from God.'),
      ],
    },
    {
      id: 'creation-p13',
      background: 'creation-p13.png',
      artBrief:
        'Adam and Eve standing with heads bowed in soft golden light. Gentle and sad ' +
        'rather than frightening.',
      sentences: [
        s('"Adam! Eve! Where are you?" called God.'),
        s('"Oh no.'),
        s('You ate the fruit."'),
        s("Adam and Eve broke God's rule."),
        s('They felt very sad.'),
      ],
    },
    {
      id: 'creation-p14',
      background: 'creation-p14.png',
      artBrief:
        'Adam and Eve walking away from the garden gate, holding hands, with warm golden ' +
        'light still reaching them from behind. Bittersweet — sad but hopeful, not frightening.',
      sentences: [
        s('"You can\'t stay in this garden anymore," God said.'),
        s('"You have to go."'),
        s('Adam and Eve cried.'),
        s('"Don\'t worry," God said.'),
        s('"One day, someone will beat the snake.'),
        s('His name is Jesus.'),
        s('Then we can be together again."'),
      ],
    },
  ],

  quiz: [
    {
      prompt: 'What did God make on day one?',
      choices: [
        { label: 'light', image: '☀️', isCorrect: true, color: '#FFD166' },
        { label: 'the ocean', image: '🌊', isCorrect: false, color: '#219EBC' },
      ],
    },
    {
      prompt: 'Who were the first two people?',
      choices: [
        { label: 'Adam and Eve', image: '👥', isCorrect: true, color: '#B5E48C' },
        { label: 'the snake', image: '🐍', isCorrect: false, color: '#8ECAE6' },
        { label: 'the stars', image: '⭐', isCorrect: false, color: '#CDB4DB' },
      ],
    },
    {
      prompt: 'Who tricked Eve?',
      choices: [
        { label: 'the snake', image: '🐍', isCorrect: true, color: '#B5E48C' },
        { label: 'the moon', image: '🌙', isCorrect: false, color: '#CDB4DB' },
      ],
    },
  ],
};
