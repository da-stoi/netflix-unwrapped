import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import styled from 'styled-components';

type TextProps = {
  shadowOpacity: number
  shadowBlur: number
}

const TitleText = styled.h1<TextProps>`
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 150px;
  text-align: center;
  position: absolute;
  bottom: 365px;
  width: 100%;
  color: #E50914;
  text-shadow: 0px 0px ${props => props.shadowBlur}px rgba(0, 0, 0, ${props => props.shadowOpacity});
`


export const Title: React.FC<{
  titleText: string;
  titleColor: string;
}> = ({ titleText, titleColor }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();
  const text = titleText.split(' ').map((t) => ` ${t} `);
  return (
    <TitleText
      shadowBlur={interpolate(frame, [0, videoConfig.durationInFrames], [5, 100])}
      shadowOpacity={interpolate(frame, [0, videoConfig.durationInFrames], [0, 1])}
    >
      {text.map((t, i) => {
        return (
          <span
            key={t}
            style={{
              color: titleColor,
              marginLeft: 10,
              marginRight: 10,
              transform: `scale(${spring({
                fps: videoConfig.fps,
                frame: frame - i * 5,
                config: {
                  damping: 100,
                  stiffness: 200,
                  mass: 0.5,
                },
              })})`,
              display: 'inline-block',
            }}
          >
            {t}
          </span>
        );
      })}
    </TitleText>
  );
};
