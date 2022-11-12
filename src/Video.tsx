import { Composition } from 'remotion';
import { Main } from './Main';

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={630}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
