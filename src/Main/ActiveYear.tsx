import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { watchHistory } from './watchHistoryO';

type BarProps = {
  height: number
}

type BarLabelProps = {
  opacity: number
}

const ComponentContainer = styled.div`
  width: 100%;
  height: 100%;
`

const ChartTitle = styled.h1`
  color: white;
  font-size: 100px;
  font-weight: bold;
  text-align: center;
  margin: 10px;
  font-family: 'Roboto', sans-serif;
`

const GraphContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  align-content: flex-around;
  width: 100%;
  height: 85%;
`

const GraphBar = styled.div<BarProps>`
  flex: 0 0 auto;
  margin: 20px;
  height: ${props => props.height * 100}%;
  background-image: linear-gradient(#E50914, #F01828);
  border-radius: 20px;
  flex-grow: 1;
  text-align: center;
  color: white;
  font-family: 'Roboto', sans-serif;
`

const BarLabel = styled.h1<BarLabelProps>`
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  margin: 10px;
  font-family: 'Roboto', sans-serif;
  opacity: ${props => props.opacity};
  margin-top: -55px;
`

export const ActiveYear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1]);
  const [data, setData] = useState<any>({})
  const [max, setMax] = useState(0)

  // Get the count how many things were watched each year
  const getData = async () => {

    const results: any | {} = {};

    // Increment the year by 1 when a show is found in that year
    watchHistory.forEach(show => {
      const year: string = new Date(show.Date).getFullYear().toString();
      if (results[year]) {
        results[year] += 1;
      } else {
        results[year] = 1;
      }
    });

    setData(results)
    // @ts-ignore
    setMax(Math.max(...Object.values(results)) + (Math.max(...Object.values(results)) * 0.1))
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <ComponentContainer>
      <ChartTitle>Activity By Year</ChartTitle>
      <GraphContainer>
        {Object.keys(data).map((year, i) => (
          <GraphBar key={year} height={interpolate(frame, [i * 10, (10 + 10 * i)], [0, data[year]], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) / max} >
            <BarLabel opacity={interpolate(frame, [i * 10 + 5, (15 + 10 * i)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}>{year}<br /><span style={{fontWeight: "300", fontSize: "30px"}}>{data[year]} Items</span></BarLabel>
          </GraphBar>
        ))}
      </GraphContainer>
    </ComponentContainer>
  );
};
