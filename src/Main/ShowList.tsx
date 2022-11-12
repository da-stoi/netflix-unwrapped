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

type Season = {
  name: string
  episodes: Episode[]
}

type Show = {
  name: string
  seasons: Season[]
}

export const ShowList: React.FC = () => {
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
      console.log(show)
      const titleParts = show.Title.toString().split(":")

      if (titleParts.length === 3) {
        const name = titleParts[0].trim();
        const season = titleParts[1].trim();
        const episode = titleParts[2].trim();

        // if the show is already in the array, add the episode to the season
        if (shows.find(s => s.name === name)) {
          const showIndex = shows.findIndex(s => s.name === name)
          const seasonIndex = shows[showIndex].seasons.findIndex(s => s.name === season)

          if (seasonIndex !== -1) {
            shows[showIndex].seasons[seasonIndex].episodes.push({
              name: episode,
              date: show.Date
            })
          } else {
            shows[showIndex].seasons.push({
              name: season,
              episodes: [{
                name: episode,
                date: show.Date
              }]
            })
          }
        }
        // if the show is not in the array, add the show and the season
        else {
          shows.push({
            name: name,
            seasons: [{
              name: season,
              episodes: [{ name: episode, date: show.Date }]
            }]
          })
        }

      }
    });

    // Count total episodes in a show
    const showsWithCount = shows.map(show => {
      let episodeCount = 0;
      show.seasons.map(season => {
        episodeCount += season.episodes.length
      })

      return {
        ...show,
        episodeCount
      }
    });

    // Sort shows list by episode count
    const sortedShows = showsWithCount.sort((a, b) => b.episodeCount - a.episodeCount)

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
      <ChartTitle>Top 5 Shows</ChartTitle>
      <GraphContainer>
        {data.map(({ name, episodeCount }, i) => (
          <GraphBar key={name} height={interpolate(frame, [i * 10, (10 + 10 * i)], [0, episodeCount], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) / max} >
            <BarLabel opacity={interpolate(frame, [i * 10 + 5, (15 + 10 * i)], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}>{name}<br /><span style={{fontWeight: "300", fontSize: "30px"}}>({episodeCount} episodes)</span></BarLabel>
          </GraphBar>
        ))}
      </GraphContainer>
    </ComponentContainer>
  );
};
