import {
 Box,
 Button,
 Center,
 Flex,
 Heading,
 Icon,
 Image,
 Text,
 Wrap,
 WrapItem,
} from "@chakra-ui/react";
import React, { useState } from "react";
import pics from "../configs/pics";
import hailImage from "../weather-app-master/Hail.png";
import {RiCompassDiscoverFill} from "react-icons/Ri/"

const IndexPage = () => {
  const weatherDayProps={
    w:"175px",
    h:"200px",
  };
  const todayHighlightProps={
    w:"475px",
    h:"200px",
    bg:"#1e213a",
    display:"block",
    p:"15px"
  }
  const textProps={
    color:"white",
    textAlign:"center",
  }

  const reqURL='http://localhost:8010/proxy/';
  // const [weatherData, setWeatherData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
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
        setWeatherData(response2Data.consolidated_weather);
        console.log(weatherData);
    }
    catch (Error){
        alert(Error);
    }
  }
  return (
   <Flex>
     <Box bg="#1e213a" id="current-day-weather" w="30vw" h="100vh">
       <Flex p={5} justifyContent="space-between">
         <Button bg="gray.400">Search for places</Button>
         <Button bg="gray.400" onClick={()=>{getWeatherData()}}>(Icon)</Button>
       </Flex>
       <Center flexDir="column" bg="#1e213a">
         <Box w="50%" mb={20} id="current-day-img-container">
           <Image src={pics[weatherData[0].weather_state_abbr]} w="100%" h="100%" />
         </Box>
         <Heading mb={20} color="#e7e7eb" fontSize="6xl">{Number(weatherData[0].max_temp).toFixed(0)} C</Heading>
         <Heading mb={10} color="#e7e7eb" fontSize="2xl">
           {weatherData[0].weather_state_name}
         </Heading>
         <Flex mb={10}>
           <Text color="#e7e7eb">Today</Text>
           <Text color="#e7e7eb">(Oct 6th, 2021)</Text>
         </Flex>
         <Text color="#e7e7eb">Toronto</Text>
       </Center>
     </Box>
     <Center bg="#100e1d" id="weeks-weather" w="70vw" h="100vh" p="30px 150px" display="inline-block">
        <Flex justifyContent="flex-end" w="100%">
          <Button borderRadius="20px" mr="10px">C</Button>
          <Button borderRadius="20px">F</Button>
        </Flex>
        <Flex justifyContent="space-between" m="50px 0">
          {weatherData.map((day, i)=>{
            if (i != 0){
              return (
                <Center {...weatherDayProps} display="block" p="15px" bg="#1e213a" key={i}>
                  <Text color="#e7e7eb" textAlign="center" fontWeight="bold">{day.weather_state_name}</Text>
                  <Image m="auto" src={pics[day.weather_state_abbr]} boxSize="100px"/>
                  <Text color="#e7e7eb" textAlign="center" fontWeight="bold">{Number(day.max_temp).toFixed(0)} C </Text>
                  <Text color="#616475" textAlign="center">{Number(day.min_temp).toFixed(0)} C</Text>
                </Center>
              );
            }
          })}
        </Flex>
        <Text fontWeight="bold" fontSize="2xl" color="white">Today's Highlights</Text>
        <Flex w="100%" justifyContent="space-between" m="30px 0">
          <Center {...todayHighlightProps}>
            <Text color="#e7e7eb" textAlign="center">Wind status</Text>
            <Text color="#e7e7eb" textAlign="center" fontWeight="bold" fontSize="6xl">{Number(weatherData[0].wind_speed).toFixed(0)} mph</Text>
            <Center m="10px 0">
              <RiCompassDiscoverFill size="30px" rotate={70} color="#616475"/>
              <Text color="#e7e7eb" textAlign="center" ml="10px">{weatherData[0].wind_direction_compass}</Text>
            </Center>
          </Center>
          <Center {...todayHighlightProps}>
            <Text color="#e7e7eb" textAlign="center">Humidity</Text>
            <Text color="#e7e7eb" textAlign="center" fontWeight="bold" fontSize="6xl">{weatherData[0].humidity}%</Text>
            <Text color="#e7e7eb" textAlign="center">Scale</Text>
          </Center>
        </Flex>
        <Flex justifyContent="space-between">
          <Center {...todayHighlightProps} h="150px">
            <Text color="#e7e7eb" textAlign="center">Visibility</Text>
            <Text color="#e7e7eb" textAlign="center" fontWeight="bold" fontSize="6xl">{Number(weatherData[0].visibility).toFixed(1)} miles</Text>
          </Center>
          <Center {...todayHighlightProps} h="150px">
            <Text color="#e7e7eb" textAlign="center">Air Pressure</Text>
            <Text color="#e7e7eb" textAlign="center" fontWeight="bold" fontSize="6xl">{Number(weatherData[0].air_pressure).toFixed(0)} mb</Text>
          </Center>
        </Flex>
     </Center>
   </Flex>
 );
};
 
export default IndexPage;
 

