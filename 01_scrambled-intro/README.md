# Scrambled text Intro

The goal of this experiment is to gradually reveal some text leading with random characters.

### Example

[![A video clip showing Call of Duty Modern Warfare's text intro](https://img.youtube.com/vi/F9MLNSejC5c/0.jpg)](https://youtu.be/F9MLNSejC5c?si=sUtuDRT7NPGqgoBS)

## Concepts Used

On top of DOM Manipulation, the following concepts will be used to build this feature

| **Concept**                                                                                          | **Reason**                                                                                |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | To asynchronously perform an action while eventually returning the correct character.     |
| [Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)                             | To repeat a function until the function's inner condition is met                          |
| Timed loop                                                                                           | Combining `setTimeout` with recursion to control how fast the character generation occurs |

## How Its Made

1.  ### Define a random number generator (RNG) between a minimum and maximum number

    ```js
    function rng(min = 1, max = 10) {
      return Math.round(Math.random() * (max - min + 1) + min);
    }
    ```

1.  ### Generate a random [ASCII character](https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html) using the RNG function and [`String.fromCharCode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode) method.

    ```js
    function genRandomChar() {
      return String.fromCharCode(rng(33, 126));
    }
    ```

1.  ### Reveal a single character after generating `n` random characters (`scrambleRevealChar`).

    This function returns a resolved promise which contains the specified character. Before returning the specified character, we generate a given number of random characters.

    #### Generating `n` random characters (scrambleLoop)

    A new function:

    - Generates a character a number of times if its below the limit.
    - **Below limit**:
      - Applies changes to the UI then runs the same function again
      - Increases the count (`scambleCount`)
      - Run the same function at a given time (recursion)
    - **Reaches limit**: Resolves the promise containing the specified character

    ```js
    function scrambleRevealChar(char, count, speedMs) {
      return new Promise((resolve) => {
        let scrambleCount = 0;

        const scrambleLoop = () => {
          if (scrambleCount < count) {
            // Update UI with scrambled character
            targetElement.textContent = displayStr + genRandomChar();
            scrambleCount++;

            setTimeout(scrambleLoop, speedMs); // <- Timed Recursive loop
          } else {
            resolve(char);
          }
        };

        scrambleLoop();
      });
    }
    ```

    Essentially, calling the `scrambleLoop` function in a `setTimeout()` with a delay creates a **_Timed recursive loop_**.

1.  ### Animating The Text (`animateString`)

    This function doesn't _actually_ animate the text; it builds it word by word.

    - `scrambleRevealChar` animates the text by character generation
    - The `for-loop` in `animateString`:

      - Assembles the string when the promise is resolved
      - Displays it in the UI

      ```js
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
      ```

    **Note:** This function doesn't generate random text for empty spaces.
