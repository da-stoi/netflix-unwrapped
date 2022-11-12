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
  font-size: 80px;
  line-height: 135px;
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
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: 10px;
  font-family: 'Roboto', sans-serif;
  opacity: ${props => props.opacity};
  margin-top: -80px;
`

type Episode = {
  name: string
  date: string
}

type Show = {
  name: string
  episodes: Episode[]
}

export const MostBinged: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1]);
  const [data, setData] = useState([])
  const [max, setMax] = useState(0)

  // Get the count how many things were watched each year
  const getData = async () => {
    const shows: Show[] = [];

    // Increment the year by 1 when a show is found in that year
    watchHistory.forEach(show => {
      const titleParts = show.Title.toString().split(":")

      if (titleParts.length === 3) {
        const name = titleParts[0].trim();
        const episode = titleParts[2].trim();

        // if the show is already in the array, add the episode to the season
        if (shows.find(s => s.name === name)) {
          const showIndex = shows.findIndex(s => s.name === name)

          shows[showIndex].episodes.push({
            name: episode,
            date: show.Date
          })
        }
        // if the show is not in the array, add the show and the season
        else {
          shows.push({
            name: name,
            episodes: [{
              name: episode,
              date: show.Date
            }]
          })
        }
      }
    });

    console.log(shows)
    
    // Sort and categorize episodes by date
    const mostBinged = shows.map(show => {

      const dates: any = {}
      
      show.episodes.forEach(episode => {

        if (dates[episode.date]) {
          dates[episode.date]++
        } else {
          dates[episode.date] = 1
        }
      })

      // Sort the dates by most watched
      const sortedDates = Object.keys(dates).sort((a, b) => {
        return dates[b] - dates[a]
      })

      return {
        name: show.name,
        topDate: sortedDates[0],
        episodeCount: dates[sortedDates[0]],
      }
    }) 

    // Sort most binged shows by most watched
    const sortedShows = mostBinged.sort((a, b) => {
      return b.episodeCount - a.episodeCount
    })

    // Get the top 5 shows
    const top5: any = sortedShows.slice(0, 5)

    setData(top5)
    setMax(top5[0].episodeCount + (top5[0].episodeCount * 0.1))
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <ComponentContainer>
      <ChartTitle>Most Binged (episodes in one sitting)</ChartTitle>
      <GraphContainer>
        {data.map(({ name, topDate, episodeCount }, i) => (
          <GraphBar key={name} height={interpolate(frame, [i * 10, (10 + 10 * i)], [0, episodeCount], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) / max} >
            <BarLabel opacity={interpolate(frame, [i * 10 + 5, (15 + 10 * i)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}>{name}<br /><span style={{fontWeight: "300", fontSize: "30px"}}>({episodeCount} on {topDate})</span></BarLabel>
          </GraphBar>
        ))}
      </GraphContainer>
    </ComponentContainer>
  );
};
