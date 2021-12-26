import {
 Box,
 Button,
 Center,
 Flex,
 Heading,
 Icon,
 IconButton,
 Image,
 Progress,
 Text,
 Wrap,
 WrapItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import pics from "../configs/pics";
import initWeather from "../configs/initWeather";
import {RiCompassDiscoverFill} from "react-icons/Ri/";
import {MdGpsFixed, MdPinDrop} from "react-icons/Md/";


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
  const [weatherData, setWeatherData] = useState(initWeather);
  const [dates, setDates] = useState([]);
  var lat = 0, long = 0;
  // console.log(initWeather);

  if (process.browser){
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      },
      () => {
        alert("Could not get users location");
      }
    );
  }

  async function getWeatherData(){
    try{
        const response = await fetch(
        `${reqURL}search/?lattlong=${lat},${long}`);
        const responseData = await response.json();
        const woeid = responseData[0].woeid;

        const response2 = await fetch(
        `${reqURL}${woeid}`);
        const response2Data = await response2.json();
        setWeatherData(response2Data.consolidated_weather);
        console.log(responseData);

        getDates();
    }
    catch (Error){
        alert(Error);
    }
  }

  function getDates(){
    var dateTemp = [];
    weatherData.map((day, i)=>{
      const createdAt = day.created.substring(10);
      const applicableAt = day.applicable_date;
      var currDate = new Date(applicableAt.replace(/-/g, '\/')).toDateString();

      if (i == 0 || i != 1){
        dateTemp[i] = currDate.substring(0, currDate.length-4)
      }
      else{
        dateTemp[1] = "Tomorrow";
      }
    });
    setDates(dateTemp);
  }

  return (
   <Flex>
     <Box bg="#1e213a" id="current-day-weather" w="30vw" h="100vh">
       <Flex p={5} justifyContent="space-between">
         <Button _focus={{boxShadow: "none"}} bg="gray.400" borderRadius="0" color="white">Search for places</Button>
         <IconButton aria-label="Use Current Location" 
          icon={<MdGpsFixed size="60%"/>} 
          bg="gray.400" 
          borderRadius="20px"
          color="white"
          _focus={{boxShadow: "none"}}
          onClick={()=>{getWeatherData();}}/>
       </Flex>
       <Center flexDir="column" bg="#1e213a" justifyContent="space-between">
         <Image src={pics["bg"]} w="550px" zIndex={0} position="fixed" opacity="10%"/>
         <Box w="50%" mb={20} id="current-day-img-container">
          <Image src={pics[weatherData[0].weather_state_abbr]} zIndex={1} w="100%" h="100%"/>
         </Box>
         <Flex>
           <Heading mb={20} color="#e7e7eb" fontSize="9xl" fontWeight="normal">{Number(weatherData[0].max_temp).toFixed(0)}</Heading>
           <Heading color="#e7e7eb" fontSize="2xl" fontWeight="normal">o</Heading>
           <Heading color="#e7e7eb" fontSize="5xl" fontWeight="normal">C</Heading>
         </Flex>
         <Heading mb={20} color="#e7e7eb" fontSize="2xl">
           {weatherData[0].weather_state_name}
         </Heading>
         <Flex mb={5}>
           <Text color="#616475" m="0 10px">Today</Text>
           <Text color="#616475" m="0 10px">{dates[0]}</Text>
         </Flex>
         <Flex>
           <MdPinDrop color="#616475" size="20px"/>
           <Text color="#616475">Toronto</Text>
         </Flex>
         
       </Center>
     </Box>
     <Center bg="#100e1d" id="weeks-weather" w="70vw" h="100vh" p="30px 150px" display="inline-block" zIndex={1}>
        <Flex justifyContent="flex-end" w="100%">
          <Button _focus={{boxShadow: "none"}} borderRadius="20px" mr="10px" color="white" bg="#585676">C</Button>
          <Button _focus={{boxShadow: "none"}} borderRadius="20px" color="white" bg="#585676">F</Button>
        </Flex>
        <Flex justifyContent="space-between" m="50px 0">
          {weatherData.map((day, i)=>{
            if (i != 0){
              return (
                <Center {...weatherDayProps} display="block" p="15px" h="210px" bg="#1e213a" key={i}>
                  <Text color="#e7e7eb" textAlign="center" fontWeight="normal">{dates[i]}</Text>
                  <Center m="auto" w="100px" h="110px">
                    <Image m="auto" src={pics[day.weather_state_abbr]} w="90px"/>
                  </Center>
                  <Text color="#e7e7eb" textAlign="center" fontWeight="normal">{Number(day.max_temp).toFixed(0)} C </Text>
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
            <Flex justifyContent="space-between" w="80%" m="0 45px">
              <Text color="#e7e7eb" textAlign="center">0</Text>
              <Text color="#e7e7eb" textAlign="center">50</Text>
              <Text color="#e7e7eb" textAlign="center">100</Text>
            </Flex>
            <Progress value={weatherData[0].humidity} w="80%" m="0px 45px" borderRadius="8px" colorScheme="yellow"/>
            <Text color="#e7e7eb" textAlign="right" w="80%" m="0px 45px">%</Text>
            
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
 

