# Replay Keystroke Sound

![](./assets/start-screen.png)

## About the Experiment

This is a web app used for an academic experiment aiming at comparing human subjects' performance in identifying keystroke sequence variance with that of a computer. You can run it on your browser by [visiting this link](https://huayunh.github.io/replay-keystroke-sound/build). To gain a deep understanding to this problem, the experiment is broken into two separate separate tasks: "Are they the same" and "Who typed it".

### Task: Are They The Same

This task aims at answering the question "how well can a human detect variations in keystroke typing sound". In each question, subjects will be given two clips, "clip 1" and "clip 2", which are usually highly similiar to each other. After clicking on both clips and listen, subjects are then asked to make their judgement on whether these two clips are identical, and indicate their confidence level. This is done by clicking on a slider, where the left end means the two clips are definitely not the same, the right end means the subject is very confident that the two clips are identical, and the mid point indicates that they are ambiguous. This set up is similar to a [visual analogue scale (VAS)](https://www.physio-pedia.com/Visual_Analogue_Scale).

![overview](./assets/are-they-the-same.gif)

In addition to the experiment configurations (explained below in the "Configurations and Parameters" section), the following events are also recorded in the log file: a clip is played / stopped, a subject clicked on a VAS, a subject clicked on the submit button, and whether the question is answered correctly.

### Task: Who Typed It

TODO

### Data Set

All data used in the experiment is based on keystroke data collected in Killourhy and Maxion's Keystroke Dynamics Benchmark Data Set from 2009. During this 2009 experiment, all subjects were asked to type the same string, `.tie5Roanl`, for 400 times (8 sessions, 50 repetitions per session). You may read more about that [on their web page](https://roymaxion.github.io/projects/keystroke-benchmark/benchmark-data-set.html).

This experiment uses all the "keydown" events from the data set to recreate typing sequences. TODO: talk about why we only take the last 10 reps. and how we are taking one out as the test clip. Talk about how presets work.

## Configurations and Parameters

### The Config Panel

In the "Set Up the Experiment" page, you will see a floating action button (FAB) to the bottom right corner of your browser. Clicking on this will bring up the config panel, where you can control advanced settings of the tasks.

![](./assets/config-panel.png)

During an experiment, the FAB is hidden from subject by default to prevent subject from altering the settings, but it remains interactive. Hover around the bottom right corner until your mouse cursor turns into a pointer. Then you can access the config panel as you normally would. The FAB's hidden-during-experiment behavior can be changed by toggling on the "Config Panel Button Stays Visible" setting in the config panel.

### URL Parameters

Experimenters can bookmark the URL to save their settings and reuse them next time they want to run the experiment using the same configuration. This is done by using [URL parameters](<https://www.semrush.com/blog/url-parameters/#:~:text=URL%20parameters%20(known%20also%20as%20%E2%80%9Cquery%20strings%E2%80%9D%20or%20%E2%80%9CURL%20query%20parameters%E2%80%9D)%20are%20elements%20inserted%20in%20your%20URLs%20to%20help%20you%20filter%20and%20organize%20content%20or%20track%20information%20on%20your%20website.>) — every time you make a change to experiment configurations, your URL would change. For example, the first time you open the webpage, the URL address is

```
https://huayunh.github.io/replay-keystroke-sound/build/
```

if you specify the preset to be "Preset C", then you will notice the URL now changes to

```
https://huayunh.github.io/replay-keystroke-sound/build/?preset=Preset%20C
```

### All Parameters

| Name                 | Accepted Values (TypeScript Notation)                           | Accepted Values ([Encoded](https://en.wikipedia.org/wiki/Percent-encoding) URL) | Description                                                                                                                                                                                                                                                                                                                                                                                                          | Default Value |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| subjectID            | `string`                                                        | any string                                                                      | A unique identifier for the subject performing the experiment.                                                                                                                                                                                                                                                                                                                                                       |               |
| preset               | <code>'Random' \| 'Preset A' \| 'Preset B' \| 'Preset C'</code> | `Random` or `Preset%20A` or `Preset%20B` or `Preset%20C`                        | Whether to let the program randomly select typists, or to use a pre-defined set of typists.                                                                                                                                                                                                                                                                                                                          |               |
| isFABVisible         | `boolean`                                                       | `true` or `false`                                                               | Whether the floating action button (FAB) on the bottom right corner that can open the configuration panel is open or not.                                                                                                                                                                                                                                                                                            | `false`       |
| isProgressBarVisible | `boolean`                                                       | `true` or `false`                                                               | When a subject plays a typing sequence clip, whether they will see the light blue progress bar or not.                                                                                                                                                                                                                                                                                                               | `true`        |
| variedKeystrokeSound | `boolean`                                                       | `true` or `false`                                                               | Whether to alternate between hard key press sounds and soft key press sounds.                                                                                                                                                                                                                                                                                                                                        | `true`        |
| repsPerTrainingClip  | `number`                                                        | an integer                                                                      | In the "who typed it" task, this controls the number of "reps" sampled from `src/assets/data.json`. <br />For example, `data.json` currently contains 10 reps for each typist. if this parameter is set to 6, then rep No.5 - rep No.10 is played to the subject for each chosen typist. In this example, `repsPerTrainingClip`'s allowed range value is 1-9, because rep No.1 is always reserved as a testing clip. | `1`           |
| silenceBetweenReps   | `number`                                                        | an integer                                                                      | When one rep of a typist is played, how many milliseconds to wait before playing the next rep. Must be greater than 500.                                                                                                                                                                                                                                                                                             | `1500`        |
| playbackSpeed        | <code>0.5 \| 0.75 \| 1.0 \| 1.25</code>                         | `0.5` or `0.75` or `1.0` or `1.25`                                              | The speed at which any clips are played. `1.0` is the regular speed. `0.5` means twice as slow (like "x0.5") while `1.25` means the audio is speed up by 25% ("x1.25").                                                                                                                                                                                                                                              | `1.0`         |

## Log File

### Download the File

When the experiment reaches its end stage

### Interpret

## For Developers

The following content is for developers who understand web development and want to alter some fundamental behaviors of the project, such as adding new pages and altering presets.

### Environment

This project is constructed using JavaScript under the [React](https://reactjs.org/) framework, and with significant help from [MUI](https://mui.com/) (for UI components) and [React Redux](https://react-redux.js.org) (for state controls). At the time I built the project, I was on [node](https://nodejs.org/en/) v14.17.6, [yarn](https://yarnpkg.com/) v1.22.10, MacOS 11.6.3 and Google Chrome version 100.0.4896.127. If you want to get identical result as mine, you would need to set up the same dev environment.

### Commands

I will not repeat the basics of [how-to-git](https://git-scm.com/) here. The following content assumes you've set up your environment, cloned the project from [my repository](https://github.com/huayunh/replay-keystroke-sound) and is currently at the project root directory.

To run, do `yarn && yarn start`.

To build data, do `yarn update-data`. This will xxxx.

Before you `git push`, run `yarn build` so that the latest code get built in the production mode.

### File Tree

(TODO: a file tree for what each folder stores, and where to look for what)

### To Add / Delete a Preset

TODO

### To Change Preset Values

The preset values are all stored at `src/shared/constants.js`. To change the value of a preset, you may simply edit the file directly and save.

### To Adjust What's Exported in the CSV Log File

There are three sections in a log file: a list of parameters and their values, a summary of what the subject answered to each question and whether they answered the questions correctly or not, and a event detail log. The first two sections are generated using the `src/components/DownloadButton.jsx` file; the third one is generated by calling the `logText` function in line 53 of `src/redux/appSlice.js`.

TODO
