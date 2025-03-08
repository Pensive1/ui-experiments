"use strict";

// // Theory
// // 1: Define random number gernerator function
// // 2: Define char gernerator function
// // 3: Split the string into an array
// //  3.1: For each word, generate a character in the UI (until the gen counter matches)
// //  3.2: At the end, return the correct character
// // 4: Add the correct character to the display text
// // 4. Show (update) the display string to the UI
// // 5. Repeat for each character

// Create a target element in the DOM (if not already present)
let targetElement = document.getElementById("scrambleIntro");
let form = document.getElementById("test");

let strExample = "Hello World";
let displayStr = ""; // The string being built progressively
const speedMs = 15; // Speed of scrambling per character
const scrambleCount = 7; // Number of times to scramble each character

/**
 * Returns a random number between a minimum and maximum value
 * @param {number} min A minimum number
 * @param {number} max A maximum number
 * @returns {number}
 */
function rng(min = 1, max = 10) {
  return Math.round(Math.random() * (max - min + 1) + min);
}

/**
 * Generates a random ASCII character
 * @returns {string}
 */
function genRandomChar() {
  return String.fromCharCode(rng(33, 126));
}

/**
 * Scrambles a character multiple times before revealing the actual character
 * @param {string} char The final character to reveal
 * @param {number} count Number of times to scramble
 * @param {number} speedMs Delay between each scramble
 * @returns {Promise<string>} A promise that resolves to the final character
 */
function scrambleRevealChar(char, count, speedMs) {
  return new Promise((resolve) => {
    let scrambleCount = 0;

    // recursive loop
    const scrambleLoop = () => {
      if (scrambleCount < count) {
        // Update UI with scrambled character
        targetElement.textContent = displayStr + genRandomChar();
        scrambleCount++;
        setTimeout(scrambleLoop, speedMs);
      } else {
        // The resolved character is sent to the calling function to append it to the display string variable
        resolve(char);
      }
    };

    scrambleLoop();
  });
}

/**
 * Animates the entire string, revealing one character at a time.
 */
async function animateString() {
  displayStr = ""; // Reset the display string

  for (let i = 0; i < strExample.length; i++) {
    // Skip if the next word is a space
    if (strExample[i] === " ") {
      displayStr += " ";
      continue;
    }

    const revealedChar = await scrambleRevealChar(
      strExample[i],
      scrambleCount,
      speedMs
    );

    //Append the correct (resolved) character to the `displayStr` variable.
    displayStr += revealedChar;
    targetElement.textContent = displayStr; // Update the UI
  }
}

animateString();

// Start the animation
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form).entries();
  const [sampleTxt] = data;

  strExample = sampleTxt[1].length ? sampleTxt[1] : "Hello World";
  animateString();
});
