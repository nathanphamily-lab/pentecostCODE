**APP SPECIFICATION DOCUMENT**

Faith-Based Reading App

*Working Title: Pentecost | Version: 0.5 | Last Updated: July 8 2026*

# 1. Overview

## 1.1 One-Sentence Description

*[ Write one sentence that describes what your app does and who it's for. Example: 'A mobile reading app that teaches children ages 3–7 phonics through leveled Biblical stories, guided by an in-app mascot named Johnny.' ].*

*Pentecost* is a mobile app that uses Biblical themes to teach children ages 3-7 how to read, starting from ground zero with phonics and working its way up to basic reading skills.

## 1.2 The Problem You're Solving

*[ Describe the gap in the market. Why do Christian/homeschool families need this? What are they using now and why is it not enough? ]*

Several reports as of late have brought to light Gen Alpha’s inability to read, reflecting on the broader failures of the public school system. As more parents, especially conservative Christians, have decided to pull their kids from public school, there have not been any alternative programs out there in the market that both provide sufficient curriculum for reading and a basic catechesis in the Christian faith. These two objectives should not be mutually exclusive for average middle class families who can’t afford private education for their children.

## 1.3 Target Users

| **Primary user**     | Child, ages 3–7 (split: 3–4 and 5–7 tiers)                    |
|----------------------|---------------------------------------------------------------|
| **Secondary user**   | Parent / homeschool teacher who sets up and monitors progress |
| **Faith background** | Broadly Christian (Protestant, Catholic, non-denominational)  |
| **Device**           | iOS and Android mobile/tablet                                 |

## 1.4 Core Value Proposition

*[ What makes this different from ABCmouse, Starfall, or other reading apps? Write 2–3 sentences about your unique angle. ]*

The difference Pentecost has against its competitors is its commitment to faith-based learning and more importantly, a low-stimulating interaction loop that avoids gamifying the UX, distracting the child away from the learning objectives. Parents should have our trust knowing that Pentecost won’t be of concern to their child’s cognitive development.

# 2. Tech Stack

| **Frontend**           | React Native + Expo                              |
|------------------------|--------------------------------------------------|
| **Backend / Auth**     | Firebase (Authentication + Firestore)            |
| **Text-to-Speech**     | [ ElevenLabs / AWS Polly / Expo Speech — TBD ] |
| **Speech Recognition** | [ TBD — most complex component ]               |
| **Hosting**            | Firebase Hosting                                 |
| **Design**             | Figma                                            |
| **Prototype tool**     | Base44                                           |
| **Version control**    | [ GitHub — TBD ]                               |

Note: Speech recognition for young children (ages 3–5) is the highest technical risk in the stack. Vendor selection and testing should happen early.

# 3. App Structure & Navigation

## 3.1 Screen Map

The app has the following screens:

### Splash / Onboarding Screen:

TBD: Don’t worry about the onboarding screen just yet. For now, assume that the user has already made an account, and no other tutorials are needed.

### Home Screen:

The home screen contains a few lessons from the full content library available in the “Learn” and “Practice” screens in the navigation bar. The user should be able to horizontally scroll for more content within its respective category, just like how one looks through a library of movies on Netflix. On the left-hand side of the home screen is Johnny. He functions as the app’s mascot, and the character who audibly teaches the user, since the assumption is that the user is not a skilled reader.

In the letters category on the home screen, the names of the background screens are listed rather than separate lessons that introduce the letters. Know that these are background screens which you have made for me. In the final product, the letters category will appropriately have its lessons labeled.

### Lesson Screen:

This is what a lesson screen looks like. Johnny is audibly guiding the user in the bottom left hand corner, the instructions and/or main content is displayed in the center of the screen (if the child wants to perhaps attempt to read the directions with assistance of their parents), and the microphone interaction button is there for the child to speak (see Phonics Breakdown Screen, 4.2, and 8.3). This screen will be used for all lessons such as long vowels, special diaphragmic sounds, and other special rules and cases pertaining to pronunciation. For example, the sounds of multiple vowels together like ie, ei, au, oi, ea, etc. all will be shown with this kind of UI.

For a correct answer, the icon of the word does a little twirl or spin, and a sparkly dinging sound plays. For an incorrect answer, a staccato sound plays and the icon shakes back and forth firmly. Make these animations no greater than a couple seconds.

### Phonics Breakdown Screen:

This is a single screen with two triggers (Job A and Job B). It is the same screen visually in both cases — same layout, same word splitting into sounds, same letters lighting up, same Johnny pointing to each sound. The only thing that changes is Johnny’s opening line, which depends on how the screen was triggered. **Job A — Curiosity tap (BUILDABLE NOW, no speech recognition needed):** The child is reading along, sees a word they don’t know, and taps it. The story pauses and the word splits into its individual sounds (e.g. “snake” becomes s–n–a–ke), each sound lighting up as it plays, with the silent E grayed out. Johnny opens with an inviting line such as “Ooh, let’s look at this word!” This is curiosity-driven and optional. Tapping anywhere resumes the story. **Job B — Mispronunciation correction (BLOCKED on speech recognition — do not build yet):** The child reads a word aloud, the app detects a mispronunciation (e.g. they say “snack” instead of “snake”), and the same breakdown screen appears to walk through the correct sounds. The only difference is Johnny’s opening line, which is reassurance rather than invitation — e.g. “Almost! Let’s try it together.” He never says the child was “wrong.” This version depends entirely on the speech-recognition component, which is the project’s highest technical risk (see Section 8). It cannot be built until that is solved, so treat it as a future goal, not a current spec.

**Rule of thumb for the whole document: if a screen needs the app to understand the child’s voice, it is blocked on speech recognition and should not be built yet. If it only needs a tap, it is buildable now.** Multiple pronunciation errors could be made within a single word. To understand what I mean, let’s say that the user gets both the silent “e” incorrectly as well as the “sn” diaphragmic sound which is instead pronounced as two syllables. This issue might be something of concern for the future, but as of now, do not worry about that. We will eventually find a way to create this screen that walks through a tutorial of correcting multiple errors.

### Story Screen:

Users will progress through their learning by having it supplemented with Johnny’s narration of Biblical stories. (For the final product, I will officially give you modified/abridged scripts of my own so that these stories can be told appropriately to children.) Stories will be unlocked as the reader progresses and has acquired the necessary skills to tackle the story’s reading level. As always, the screen will show the subtitles to the story, but Johnny will always read the story aloud. The goal with these stories is first to have the user *read to*, not to have them reading on their own already.

### Quiz Screen:

Here is an example of a quiz screen. Quizzes can appear after readings, lessons, or as standalones. They can also vary in difficult as well. I will most likely create a simple difficulty scale so that both users and parents can know the difficulty they’re going to be working with.

### Progress / Profile Screen: 

The progress screen is a sub screen that is accessible through the profile tab (highlighted in the picture). This screen is shown and described instead because the first page on the profile tab will show other generic information (undecided). The progress screen will be subject to improvements in future updates, but the metrics and statistics displayed in this screen paint a good idea of how progress is measured. Each of the 4 bars (pronunciation, comprehension, fluency, and vocabulary) upon tapping them will have their own subsets of data that will be displayed. For example, tapping on pronunciation will show the percent accuracies of different kinds of sounds. Let’s say basic CVC words have 97% accuracy, but long vowel sounds and silent e sounds are lower. This helps give both parents and their child and report on their performance. Progress reports should always be accessible and never behind a password-protected page.

*[ Add or remove screens as your app evolves. Every screen the child can reach should be listed here. ]*

## 3.2 Navigation Flow

*[ Describe how screens connect. Example: 'Home → tap lesson card → Lesson Screen → tap word → Phonics Breakdown (modal overlay) → dismiss → back to Lesson Screen → finish story → Quiz Screen → results → Home.' Draw this out on paper and describe it here. ]*

There sit 5 different tabs on the main menu on the bottom of each screen, except for screens like lessons, practice, and other activities which require you to exit to the main menu. Those 5 tabs are titled “Home,” “Learn,” “Practice,” “Profile,” and “Settings.”

The “home” tab and “profile” tabs are shown and described in this document. The “learn” and “practice” tabs will follow the same horizontally scrollable layout as the home screen but will include the app’s full content library. The learn tab houses all the lessons, whereas the practice tab houses all the homework, although it isn’t all that exciting for children to figure out that their parents are giving them extra homework! Thus, the tab is called practice, but it essentially is homework.

The UI in the practice tab (quiz screen) looks and functions just like in the lesson tab (quiz screen), but the user cannot receive help of any kind. Obviously, nothing is stopping a parent from assisting a child, but the goal is to get a more formal assessment of a child’s performance. Johnny will be able to talk/walk through areas of improvement gently and productively with the user after the practice is over, and the phonics breakdown screen can appear. The feedback interactions after a quiz in the practice tab will be the same two functions as Job A and B, but only Job A will be developed as of now.

There’s nothing special about the settings tab. It looks and operates just like any other one would, housing menial app preferences.

## 3.3 Content Rows (Home Screen)

| **Start Here**     | Ages 0–4 foundational content (Johnny introduces letters, sounds) |
|--------------------|-------------------------------------------------------------------|
| **Bible Stories**  | Leveled story library (Creation, Noah, David & Goliath, etc.)     |
| **Letters A–Z**    | Individual letter sound lessons                                   |
| **Sight Words**    | High-frequency words by level                                     |
| **Special Sounds** | Digraphs, blends, trigraphs (IGH, SH, CH, etc.)                   |
| **Ages 5–7**       | Advanced content tier                                             |

# 4. Core Interaction Loop

## 4.1 The Reading Experience

This is the most important mechanic in the app. Describe exactly what the child sees and does:

| **Step 1** | Child opens a story. Illustrated background loads. Text appears in large font.                                     |
|------------|--------------------------------------------------------------------------------------------------------------------|
| **Step 2** | Story reads aloud automatically. Each word highlights in yellow as it is spoken.                                   |
| **Step 3** | Child can tap any word at any time to pause and trigger a phonics breakdown.                                       |
| **Step 4** | Phonics breakdown shows the word split into individual sounds, each lighting up as the sound plays. Johnny reacts. |
| **Step 5** | Child taps anywhere to resume. Story continues from where it paused.                                               |
| **Step 6** | End of story: comprehension question with 2–3 picture-based answer choices.                                        |
| **Step 7** | Correct answer → Johnny celebrates → return to home screen with progress updated.                                  |

## 4.2 Speech Recognition Flow

*[ Describe how the microphone interaction works when the child is asked to repeat a sound or word. What happens if they get it right? What happens if they get it wrong? How many attempts before it moves on? This is TBD until you choose a speech recognition vendor. ]*

Status: design intent below, but BLOCKED on speech-recognition vendor selection (see Section 8.1). Do not build the voice-matching portion yet. The tap-based fallback described at the end is buildable now.

**Intended flow (future):** Johnny models a sound or word and prompts the child to repeat it. The child taps the microphone button and speaks. The app listens for a short window (roughly 3–4 seconds) and compares the child’s attempt against the target sound. On a correct match, the target icon does a short celebratory spin with a sparkle/ding sound and Johnny praises the child. On an incorrect match, a brief staccato sound plays, the icon shakes firmly, and Johnny gently re-models the sound (never says “wrong”). The child gets up to three attempts; after the third, Johnny says something encouraging and the lesson advances anyway so the child is never stuck or discouraged. Animations stay under ~2 seconds to keep the pace calm.

**Buildable-now fallback (no speech recognition):** Until a vendor is chosen, the microphone button can record the child’s attempt, wait the listening window, and then always advance with positive reinforcement (the current Base44 placeholder behavior). This lets the full lesson flow be built and tested now, with real voice-matching dropped in later without changing the surrounding screens.

## 4.3 Johnny the Mascot

| **Who is Johnny?**        | A friendly cartoon boy who guides the child through every lesson                                                        |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Where does he appear?** | Corner of screen in all lesson and quiz screens                                                                         |
| **What does he do?**      | Celebrates correct answers, gently encourages on wrong answers, introduces each lesson, prompts the child to try sounds |
| **Voice**                 | [ TBD — warm, slow, child-friendly ]                                                                                  |
| **Animations needed**     | Idle, celebrate, encourage, thinking, point-to-word                                                                     |

# 5. Content Library

## 5.1 Reading Level Tiers

| **Tier 1 (Ages 3–4)** | CVC words, letter sounds, simple 3–5 word sentences        |
|-----------------------|------------------------------------------------------------|
| **Tier 2 (Ages 5–6)** | Sight words, consonant blends, 6–8 word sentences          |
| **Tier 3 (Age 7+)**   | Digraphs, trigraphs, multi-syllable words, longer passages |

## 5.2 Biblical Story Scope (Prototype)

The following stories are planned for the initial prototype build:

| **Story**                    | Tier | Key Phonics Focus | Status              |
|------------------------------|--------------------------------------------------|
| **The Creation (Genesis 1)** | 1 | CVC words, basic sight words | In progress |
| **Noah's Ark**               | 1 | Short vowels, -ck words | Planned          |
| **Baby Moses**               | 1 | Long vowels, silent E | Planned            |
| **David & Goliath**          | 2 | Blends, digraphs | Planned                 |
| **Daniel in the Lion's Den** | 2 | R-controlled vowels | Planned              |
| **Joseph & His Brothers**    | 3 | Multi-syllable, complex vowels | Planned   |
| **Sermon on the Mount**      | 3 | Advanced fluency | Planned                 |

*[ Fill in the phonics focus for each story after completing your curriculum mapping session. ]*

# 6. Screens in Detail

## 6.1 Home Screen

| **Layout**           | Netflix-style horizontal scroll rows, one per content category          |
|----------------------|-------------------------------------------------------------------------|
| **Header**           | App logo + child's name/avatar if logged in                             |
| **Row structure**    | Row title (bold) + horizontally scrollable lesson cards                 |
| **Lesson card**      | Illustrated thumbnail + title + lock icon if not yet unlocked           |
| **Active vs locked** | Active cards are full color; locked cards are grayed out with lock icon |
| **Johnny**           | Not present on home screen (he lives inside lessons)                    |
| **Navigation**       | Tapping a card navigates to that lesson screen                          |

## 6.2 Lesson / Story Screen

| **Background**     | Illustrated scene matching the story (e.g., sky + sun + grass for Creation) |
|--------------------|-----------------------------------------------------------------------------|
| **Text card**      | Rounded white card in center of screen, 2–3 lines at a time                 |
| **Font**           | Large, child-friendly, rounded typeface (e.g., Nunito or Fredoka One)       |
| **Word highlight** | Yellow background appears behind each word as it is spoken aloud            |
| **Tap behavior**   | Tapping a word pauses audio and triggers phonics breakdown                  |
| **Progress bar**   | Bottom of screen, shows X / Y sentences completed                           |
| **Johnny**         | Small in bottom-left corner, reacts to taps and completions                 |
| **Controls**       | Pause/play button; back arrow to return to home                             |

## 6.3 Phonics Breakdown Screen

| **Trigger**       | Two triggers, one screen. Job A (BUILD NOW): child taps any word during story playback. Job B (BLOCKED on speech recognition): app detects a mispronunciation. See Section 3.1 for the full description.                                                                                                                         |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Display**       | Word appears large in center; splits into individual phonemes                                                                                                                                                                                                                                                                    |
| **Animation**     | Each letter/phoneme lights up in sequence as its sound plays                                                                                                                                                                                                                                                                     |
| **Special rules** | Silent E grays out with label 'silent'; digraphs highlight together                                                                                                                                                                                                                                                              |
| **Johnny**        | Points to each phoneme as it lights up. His opening line depends on the trigger: for a curiosity tap (Job A) it is an invitation (“Ooh, let’s look at this word!”); for a correction (Job B) it is reassurance (“Almost! Let’s try it together.”). Same screen, different intro line — he never tells the child they were wrong. |
| **Dismiss**       | Tap anywhere outside the breakdown card to resume story                                                                                                                                                                                                                                                                          |

## 6.4 Quiz Screen

| **Trigger**        | Appears automatically after final sentence of story           |
|--------------------|---------------------------------------------------------------|
| **Format**         | 1–3 questions; picture-based answer choices (2–3 options)     |
| **Correct answer** | Celebratory animation + Johnny reacts + move to next question |
| **Wrong answer**   | Johnny gently encourages; correct answer highlights; move on  |
| **Completion**     | Summary screen with stars earned; return to home              |

*[ Add remaining screens (onboarding, parent dashboard, progress screen) as you design them. ]*

# 7. Visual Design

| **Color palette**           | Saturated crayon-box colors — reference: Starfall                      |
|-----------------------------|------------------------------------------------------------------------|
| **Layout reference**        | Horizontal scroll rows — reference: Netflix, Hallow                    |
| **Typography**              | Large, rounded, child-friendly font (Nunito / Fredoka One)             |
| **Illustrated backgrounds** | Soft watercolor/cartoon style matching each story setting              |
| **Tap targets**             | Minimum 48x48pt for child fingers; all interactive elements oversized  |
| **Animations**              | Smooth, non-jarring; no rapid flashing; calming pace                   |
| **Screen brightness**       | App should not be overstimulating — no autoplay video, no flashing ads |

*[ Add your Figma file key here once designs are finalized: figma.com/file/[KEY] ]*

# 8. Known Risks & Open Questions

## 8.1 Technical Risks

| **Speech recognition** | HIGHEST RISK. Detecting phoneme accuracy in ages 3–5 is an unsolved problem commercially. Vendor TBD. Consider fallback: tap-to-confirm instead of voice match. |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **TTS voice quality**  | Generic robot voice will kill engagement. Need warm, slow, child-appropriate voice. ElevenLabs custom voice is best option but costs money.                     |
| **Offline access**     | Will the app work without internet? Parents in areas with poor connectivity need this answered early.                                                           |
| **iOS/Android parity** | Expo helps but some native features (mic access, audio) behave differently across platforms.                                                                    |

## 8.2 Content Risks

| **Story writing quality** | Biblical stories for a 5-year-old at Tier 1 phonics level require a skilled writer. AI-generated content needs heavy editorial review. |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Theological accuracy**  | Broadly Christian framing must be reviewed to ensure it doesn't conflict with Catholic or mainline Protestant doctrine.                |
| **Scope creep**           | The story library could expand infinitely. Need a clear cutoff for the MVP content set.                                                |

## 8.3 Open Questions

These are decisions that are not yet final. Until they are, do not assume an answer — flag the decision instead. Items marked LEANING have a current best guess but are not locked.

**Business & accounts**

- Pricing model: LEANING subscription (monthly/annual) as the default, with a possible one-time “lifetime/family” option for committed multi-child families. Not locked. Exact price points and free-trial length TBD.

- Account structure: DECIDED — one shared family login (parent is the account holder) with multiple child profiles underneath, each tracking its own progress. The parent dashboard belongs to the account holder.

- Parent dashboard PIN: open — is a PIN actually needed, or is it enough that the dashboard simply lives under the parent’s login? (Noted in Section 3.1.)

**Technical**

- Speech-recognition vendor: OPEN and highest-priority. This blocks all voice-matching features (see Sections 4.2 and 8.1). Fallback if unsolved: tap-to-confirm instead of voice match.

- Text-to-speech vendor: OPEN — ElevenLabs vs AWS Polly vs Expo Speech (see Section 2). Affects voice warmth and cost.

- Offline access: LEANING toward supporting downloaded lessons for offline use, with online for sync and account features. Not locked; affects data architecture, so decide before MVP build.

- Cross-device progress sync: open — should a child’s progress follow them across phone and tablet? (Likely yes if accounts are cloud-based via Firebase, but confirm.)

**Content & curriculum**

- MVP story cutoff: open — exactly how many stories ship in the first release? (Scope-creep risk noted in 8.2.)

- Bible translation / wording: open — which translation or paraphrase style are the adapted scripts based on, and who reviews them for theological accuracy across denominations? (Noted in 8.2.)

- Difficulty scale: open — the simple difficulty rating mentioned for quizzes/lessons (3.1) needs to be defined (what the levels are and how they map to the tiers in Section 5).

# 9. Development Phases

| **Phase** | Goal | Tools | Status |
|---|---|---|---|
| **Phase 0 — Validate** | Build prototype in Base44; test with 5–10 homeschool families | Base44 | In progress |
| **Phase 1 — Spec** | Complete this document; finalize curriculum map; define all screens | Claude, Figma | In progress |
| **Phase 2 — Design** | Full Figma mockups for all screens; finalize Johnny character design | Figma | Planned |
| **Phase 3 — Build MVP** | React Native + Expo implementation with Firebase backend | Claude Code, Expo | Planned |
| **Phase 4 — Beta** | Test with 10–15 homeschool families; iterate on feedback | TestFlight / Android Beta | Planned |
| **Phase 5 — Launch** | App Store + Google Play submission; pursue funding | — | Planned |

# 10. Funding & Pitch

## 10.1 Target Funding Sources

- USC Blackstone LaunchPad — student founder grants

- Christian EdTech investors

- Catholic/Christian foundations (education-focused)

- Homeschool curriculum publishers (licensing partnership)

## 10.2 Pitch Assets Needed

- Screen recording walkthrough of Base44 prototype

- One-page executive summary

- Slide deck (problem → solution → market → traction → ask)

- User feedback quotes from beta homeschool families

*[ Fill in funding targets, ask amount, and timeline as the project matures. ]*

# 11. Changelog

| **Date** | Version | What Changed | Author |
|---|---|---|---|
| **[5 June 2026]** | 0.1 | Initial document created | Nathan |
| **[27 June 2026]** | 0.2 | Added more visuals for screens in Section 3.1: screen map | Nathan |
| **[27 June 2026]** | 0.3 | Resolved the tap-vs-mispronunciation contradiction: Phonics Breakdown is now one screen with two triggers (Job A buildable now, Job B blocked on speech rec). Added the buildable-vs-blocked rule. Fixed the navigation tab-name contradiction (3.1 now defers to 3.2's five-tab bar). Added Johnny intro-line detail to 6.3. | Claude (reviewed by Nathan) |
| **[27 June 2026]** | 0.4 | Filled in Section 4.2 (Speech Recognition Flow) with intended flow + buildable-now fallback, marked blocked on vendor. Filled in Section 8.3 (Open Questions) with a structured list across business/accounts, technical, and content; recorded account structure as decided (one family login, multiple child profiles) and pricing as leaning subscription. | Claude (reviewed by Nathan) |
| **[8 July 2026]** | 0.5 | Defined the Learn vs. Practice tab distinction (Learn = full lesson library; Practice = homework/quiz assessment without help, same horizontal-scroll layout as Home). Clarified the Progress screen as a sub-screen under the Profile tab, with the Profile tab's own landing page marked undecided. Added a description for the Settings tab (standard app preferences, nothing special). Clarified that post-quiz feedback in the Practice tab reuses the Phonics Breakdown screen's existing Job A / Job B functions, with only Job A currently buildable. | Nathan (per Claude review) |

*Update this document every time a major decision is made or a section is finalized. This is your single source of truth.*
