import { Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { ActiveYear } from './Main/ActiveYear';
import { MostBinged } from './Main/MostBinged';
import { ShowList } from './Main/ShowList';
import { Subtitle } from './Main/Subtitle';
import { Title } from './Main/Title';
import music from './assets/music/music.mp3';

export const Main: React.FC<{
  titleText: string;
  titleColor: string;
}> = ({ titleText, titleColor }) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const { fps, durationInFrames } = videoConfig;

  const introDuration = fps * 1.5;
  const introOpacity = interpolate(
    frame,
    [introDuration - 10, introDuration],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(
    frame,
    [videoConfig.durationInFrames - 15, videoConfig.durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const partsDuration = [fps * 1.5, fps * 3, fps * 3, fps * 3]

  const volume = interpolate(frame, [0, fps, durationInFrames - fps, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp'
  });

  return (
    <div style={{ flex: 1, backgroundColor: '#141414' }}>
      <Audio
        src={music}
        volume={volume}
        startFrom={1620}
      />
      <div style={{ opacity }}>
        <div style={{ opacity: introOpacity }}>
          <Sequence from={0} durationInFrames={partsDuration[0]}>
            <Title titleText={"Netflix Unwrapped"} titleColor={titleColor} />
          </Sequence>
          <Sequence from={10} durationInFrames={partsDuration[0] - 10}>
            <Subtitle />
          </Sequence>
        </div>
        <Sequence from={partsDuration[0]} durationInFrames={partsDuration[1]}>
          <ActiveYear />
        </Sequence>
        <Sequence from={partsDuration[0] + partsDuration[1]} durationInFrames={partsDuration[2]}>
          <ShowList />
        </Sequence>
        <Sequence from={partsDuration[0] + partsDuration[1] + partsDuration[2]} durationInFrames={partsDuration[3]}>
          <MostBinged />
        </Sequence>
      </div>
    </div>
  );
};
