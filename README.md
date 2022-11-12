# Netflix Unwrapped

- [Project Page](https://daniel.stoiber.network/project/netflix-unwrapped/)

This project makes use of [Remotion](https://www.remotion.dev/), a React framework for creating videos programmatically. It takes a data download from Netflix and creates a video of your viewing history, much like Spotify's Wrapped.

## Getting Started
After downloading and installing dependencies, you'll have to go to your [Netflix account page](https://www.netflix.com/YourAccount), click on your profile, then click View under the Viewing activity section. Next, click Download all. 

This will download a CSV file with your viewing history. You'll need to convert this to JSON. You can do this using any online converter like [csvjson](https://csvjson.com/csv2json). Paste the array of JSON objects into `src/Main/watchHistory.tsx` and you're good to go!

Check the list of commands below to test your video, or to render it.

## Commands

### Install Dependencies

```console
yarn
```

### Start Preview

```console
yarn start
```

### Render video

```console
yarn run build
```

## Output
*This is a demo of the output. This GIF doesn't capture the audio, but it's there.*

![Demo Video](./assets/netflixUnwrapped.gif)