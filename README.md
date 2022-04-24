# Replay Keystroke Sound

(TODO: a screenshot)

Replay typing sound a typist made.

## Configurations and Parameters

(TODO: A screenshot to the config panel.)

| Name                 | Accepted Values (TypeScript)                         | Accepted Values (Encoded URL)                            | Description                                                                                                                                                                                                                                                                                                                                                                                                          | Default Value |
| -------------------- | ---------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| subjectID            | `string`                                             | any string                                               | A unique identifier for the subject for this study.                                                                                                                                                                                                                                                                                                                                                                  |               |
| preset               | `'Random' \| 'Preset A' \| 'Preset B' \| 'Preset C'` | `Random` or `Preset%20A` or `Preset%20B` or `Preset%20C` | Whether to let the program randomly select typists, or to use a pre-defined set of typists.                                                                                                                                                                                                                                                                                                                          |               |
| isFABVisible         | `boolean`                                            | `true` or `false`                                        | Whether the floating action button (FAB) on the bottom right corner that can open the configuration panel is open or not.                                                                                                                                                                                                                                                                                            | `false`       |
| isProgressBarVisible | `boolean`                                            | `true` or `false`                                        | When a subject plays a typing sequence clip, whether they will see the light blue progress bar or not.                                                                                                                                                                                                                                                                                                               | `true`        |
| variedKeystrokeSound | `boolean`                                            | `true` or `false`                                        | Whether to alternate between hard key press sounds and soft key press sounds.                                                                                                                                                                                                                                                                                                                                        | `true`        |
| repsPerTrainingClip  | `number`                                             | an integer                                               | In the "who typed it" task, this controls the number of "reps" sampled from `src/assets/data.json`. <br />For example, `data.json` currently contains 10 reps for each typist. if this parameter is set to 6, then rep No.5 - rep No.10 is played to the subject for each chosen typist. In this example, `repsPerTrainingClip`'s allowed range value is 1-9, because rep No.1 is always reserved as a testing clip. | `1`           |
| silenceBetweenReps   | `number`                                             | an integer                                               | When one rep of a typist is played, how many milliseconds to wait before playing the next rep. Must be greater than 500.                                                                                                                                                                                                                                                                                             | `1500`        |
| playbackSpeed        | `0.5 \| 0.75 \| 1.0 \| 1.25`                         | `0.5` or `0.75` or `1.0` or `1.25`                       | The speed at which any clips are played. `1.0` is the regular speed. `0.5` means twice as slow (like "x0.5") while `1.25` means the audio is speed up by 25% ("x1.25").                                                                                                                                                                                                                                              | `1.0`         |

## For Developers

I assume you understand React very well, and ideally with some knowledge from the MUI library.

To run, do `yarn && yarn start`.

To build data, do `yarn update-data`. This will xxxx.

Before you `git push`, run `yarn build` so that the latest code get built in the production mode.

### File Tree

(TODO: a file tree for what each folder stores, and where to look for what)

## For Experimenters

### To Add / Delete a Preset

TODO

### To Change Preset Values

The preset values are all stored at `src/shared/constants.js`. To change the value of a preset, you may simply edit the file directly and save.

### To Adjust What's Exported in the CSV Log File

There are three sections in a log file: a list of parameters and their values, a summary of what the subject answered to each question and whether they answered the questions correctly or not, and a event detail log. The first two sections are generated using the `src/components/DownloadButton.jsx` file; the third one is generated by calling the `logText` function in line 53 of `src/redux/appSlice.js`.

TODO

### Interpret the CSV Log File

TODO
