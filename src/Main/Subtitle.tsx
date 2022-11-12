import {interpolate, useCurrentFrame} from 'remotion';
import {COLOR_1} from './config';

export const Subtitle: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 30], [0, 1]);
	return (
		<div
			style={{
				fontFamily: 'Roboto Mono, Arial',
				fontSize: 40,
				textAlign: 'center',
				position: 'absolute',
				bottom: 140,
				width: '100%',
        opacity,
        color: "#ffffff"
			}}
    >
      Made by <b>Daniel Stoiber</b><br />
			daniel.stoiber.network
		</div>
	);
};
