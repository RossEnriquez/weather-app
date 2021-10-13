import {
 Box,
 Button,
 Center,
 Flex,
 Heading,
 Image,
 Text,
 Wrap,
 WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import pics from "../configs/pics";
import hailImage from "../weather-app-master/Hail.png";

const IndexPage = () => {
  const weatherDayProps={
    w:"175px",
    h:"200px",
  };
  const todayHighlightProps={
    w:"500px",
    h:"200px",
    bg:"grey"
  }
  const reqURL='http://localhost:8010/proxy/';
  // const [weatherData, setWeatherData] = useState([]);
  const weatherData=[];
  const [todayWeather, setTodayWeather] = useState([]);
  if (process.browser){
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
      },
      () => {
        alert("Could not get users location");
      }
    );
  }

  async function getWeatherData(){
    try{
        const response = await fetch(
        `${reqURL}search/?lattlong=43.7493,-79.737`);
        const responseData = await response.json();
        const woeid = responseData[0].woeid;

        const response2 = await fetch(
        `${reqURL}${woeid}`);
        const response2Data = await response2.json();
        setTodayWeather(response2Data.consolidated_weather[0])
        // setWeatherData(response2Data.consolidated_weather[1]);]
        for(let i=0; i<response2Data.consolidated_weather.length-1; i++)
          weatherData[i] = response2Data.consolidated_weather[i+1];

        console.log(weatherData);
    }
    catch (Error){
        alert(Error);
    }
  }

  return (
   <Flex>
     <Box bg="gray.200" id="current-day-weather" w="30vw" h="100vh">
       <Flex p={5} justifyContent="space-between">
         <Button bg="gray.400">Search for places</Button>
         <Button bg="gray.400" onClick={()=>{getWeatherData()}}>(Icon)</Button>
       </Flex>
       <Center flexDir="column" bg="green">
         <Box w="50%" mb={20} mr={20} id="current-day-img-container">
           <Image src={hailImage.src} w="100%" h="100%" />
         </Box>
         <Heading mb={20}>(Current temperature)</Heading>
         <Heading mb={10} fontSize="md">
           (Current day weather description)
         </Heading>
         <Flex mb={10}>
           <Text>Today</Text>
           <Text>(Oct 6th, 2021)</Text>
         </Flex>
         <Text>(Current location)</Text>
       </Center>
     </Box>
     <Center bg="blue" id="weeks-weather" w="70vw" h="100vh" p="30px 150px" display="inline-block">
        <Flex justifyContent="flex-end" bg="black" w="100%">
          <Button>C</Button>
          <Button>F</Button>
        </Flex>
        <Flex bg="red" justifyContent="space-between" m="50px 0">
          {weatherData.map((day)=>{
            return (
              <Flex {...weatherDayProps} bg="grey" border="1px solid black">
                <Text>{day.weather_state_name}</Text>
                <Image src={pics[day.weather_state_abbr]} boxSize="100px"/>
                <Text>{Number(day.max_temp).toFixed(0)} C</Text>
                <Text>{Number(day.min_temp).toFixed(0)} C</Text>
              </Flex>
            );
          })}
        </Flex>
        <Text>Today's Highlights</Text>
        <Wrap bg="white" h="450px" display="block" justify="space-between" spacing="35px">  
          <WrapItem>
            <Center {...todayHighlightProps}>
              <Text>Wind</Text>
              <Text>mph</Text>
              <Text>direction</Text>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center {...todayHighlightProps}>
              <Text>Humidity</Text>
              <Text>%</Text>
              <Text>Scale</Text>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center {...todayHighlightProps} h="150px">
              <Text>Visibility</Text>
              <Text>miles</Text>
            </Center>
          </WrapItem>
          <WrapItem>
            <Center {...todayHighlightProps} h="150px">
              <Text>Air Pressure</Text>
              <Text>miles</Text>
            </Center>
          </WrapItem>
        </Wrap>
     </Center>
   </Flex>
 );
};
 
export default IndexPage;
 

