import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import pics from "../configs/pics";
import initWeather from "../configs/initWeather";
import { RiCompassDiscoverFill } from "react-icons/Ri/";
import { MdGpsFixed, MdPinDrop, MdArrowForwardIos } from "react-icons/Md/";
import { AiOutlineSearch } from "react-icons/Ai/";

const IndexPage = () => {
  const weatherDayProps = {
    w: "175px",
    h: "200px",
  };
  const todayHighlightProps = {
    w: "475px",
    h: "200px",
    bg: "#1e213a",
    display: "block",
    p: "15px",
  };

  const reqURL = "http://localhost:8010/proxy/";
  const [weatherData, setWeatherData] = useState(initWeather);
  const [dates, setDates] = useState([]);
  const [isCelsius, setCelsius] = useState(true);
  const [location, setLocation] = useState("");
  const [latLong, setLatLong] = useState([43.658763, -79.380245]);
  const [isSearching, setSearching] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [input, setInput] = useState("");

  async function searchLocation(input: String) {
    try {
      const res = await fetch(`${reqURL}search/?query=${input}`);
      const resData = await res.json();
      const locations = [];

      for (let i = 0; i < (resData.length >= 5 ? 5 : resData.length); i++) {
        locations[i] = resData[i];
      }
      setSearchedData(locations);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCurrentLocation() {
    //find location
    if (process.browser) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatLong([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          alert("Could not get users location");
        }
      );
    }
    //get location woe id
    const response = await fetch(
      `${reqURL}search/?lattlong=${latLong[0]},${latLong[1]}`
    );
    const responseData = await response.json();
    const woeid = responseData[0].woeid;
    getWeatherData(woeid);
  }

  async function getWeatherData(woeid: Number) {
    try {
      //get weather on that location
      const response2 = await fetch(`${reqURL}${woeid}`);
      const response2Data = await response2.json();
      setWeatherData(response2Data.consolidated_weather);
      setLocation(response2Data.title);
      getDates();
    } catch (Error) {
      alert(Error);
    }
  }

  function getDates() {
    const dateTemp = [];
    weatherData.map((day, i) => {
      const applicableAt = day.applicable_date;
      const currDate = new Date(applicableAt.replace(/-/g, "/")).toDateString();

      if (i == 0 || i != 1) {
        dateTemp[i] = currDate.substring(0, currDate.length - 4);
      } else {
        dateTemp[1] = "Tomorrow";
      }
    });
    setDates(dateTemp);
  }

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Flex bg="#1e213a">
      {isSearching && (
        <Box
          p="40px"
          position="absolute"
          zIndex={1}
          w="30%"
          h="100%"
          bg="#1f213a"
        >
          <Flex justifyContent="flex-end" w="100%">
            <Button
              _hover={{}}
              variant="ghost"
              onClick={() => {
                setSearching(false);
              }}
              color="#e7e7eb"
            >
              X
            </Button>
          </Flex>
          <Flex w="100%" justifyContent="space-between" marginY="20px">
            <InputGroup w="80%" mr="20px">
              <InputLeftElement children={<AiOutlineSearch color="white" />} />
              <Input
                placeholder="Search for a city..."
                borderRadius={0}
                color="white"
                value={input}
                onChange={handleInputChange}
              />
            </InputGroup>
            <Button
              _hover={{}}
              bg="#3c47e9"
              color="#e7e7eb"
              borderRadius="0px"
              onClick={() => {
                if (input != "") searchLocation(input);
              }}
            >
              Search
            </Button>
          </Flex>

          {searchedData.map((location, i) => {
            return (
              <>
                <Button
                  _hover={{ borderColor: "gray" }}
                  key={i}
                  borderRadius={0}
                  borderWidth="1px"
                  borderColor="transparent"
                  w="100%"
                  h="60px"
                  mt="20px"
                  bg="none"
                  color="#e7e7eb"
                  rightIcon={<MdArrowForwardIos />}
                  onClick={() => {
                    getWeatherData(location.woeid);
                    setSearching(false);
                  }}
                >
                  <Text fontWeight="light" w="100%" textAlign="left">
                    {location.title}
                  </Text>
                </Button>
              </>
            );
          })}
        </Box>
      )}
      <Box id="current-day-weather" w="30vw" h="100%">
        <Flex p={5} justifyContent="space-between">
          <Button
            _focus={{ boxShadow: "none" }}
            bg="gray.400"
            borderRadius="0"
            color="white"
            onClick={() => {
              setSearching(true);
            }}
          >
            Search for places
          </Button>
          <IconButton
            aria-label="Use Current Location"
            icon={<MdGpsFixed size="60%" />}
            bg="gray.400"
            borderRadius="20px"
            color="white"
            _focus={{ boxShadow: "none" }}
            onClick={() => {
              getCurrentLocation();
            }}
          />
        </Flex>
        <Center
          flexDir="column"
          bg="#1e213a"
          justifyContent="space-between"
          h="100%"
        >
          <Image
            src={pics["bg"]}
            w="550px"
            zIndex={0}
            position="fixed"
            opacity="10%"
          />
          <Box w="50%" mb={20} id="current-day-img-container">
            <Image
              src={pics[weatherData[0].weather_state_abbr]}
              zIndex={1}
              w="100%"
              h="100%"
            />
          </Box>
          <Flex>
            <Heading mb={20} color="#e7e7eb" fontSize="9xl" fontWeight="normal">
              {Number(weatherData[0].max_temp).toFixed(0)}
            </Heading>
            <Heading color="#e7e7eb" fontSize="5xl" fontWeight="normal">
              °C
            </Heading>
          </Flex>
          <Heading mb={20} color="#e7e7eb" fontSize="2xl">
            {weatherData[0].weather_state_name}
          </Heading>
          <Flex mb={5}>
            <Text color="#616475" m="0 10px">
              Today
            </Text>
            <Text color="#616475" m="0 10px">
              {dates[0]}
            </Text>
          </Flex>
          <Flex>
            <MdPinDrop color="#616475" size="20px" />
            <Text color="#616475">{location}</Text>
          </Flex>
        </Center>
      </Box>
      <Center
        bg="#100e1d"
        id="weeks-weather"
        w="70vw"
        h="100%"
        p="30px 150px"
        display="inline-block"
        zIndex={1}
      >
        <Flex justifyContent="flex-end" w="100%">
          <Button
            _focus={{ boxShadow: "none" }}
            borderRadius="20px"
            mr="10px"
            color="white"
            bg="#585676"
            onClick={() => {
              setCelsius(true);
            }}
          >
            C
          </Button>
          <Button
            _focus={{ boxShadow: "none" }}
            borderRadius="20px"
            color="white"
            bg="#585676"
            onClick={() => {
              setCelsius(false);
            }}
          >
            F
          </Button>
        </Flex>
        <Flex justifyContent="space-between" m="50px 0">
          {weatherData.map((day, i) => {
            if (i != 0) {
              return (
                <Center
                  {...weatherDayProps}
                  display="block"
                  p="15px"
                  h="210px"
                  bg="#1e213a"
                  key={i}
                >
                  <Text color="#e7e7eb" textAlign="center" fontWeight="normal">
                    {dates[i]}
                  </Text>
                  <Center m="auto" w="100px" h="110px">
                    <Image
                      m="auto"
                      src={pics[day.weather_state_abbr]}
                      w="90px"
                    />
                  </Center>
                  {isCelsius ? (
                    <>
                      <Text
                        color="#e7e7eb"
                        textAlign="center"
                        fontWeight="normal"
                      >
                        {Number(day.max_temp).toFixed(0)} °C
                      </Text>
                      <Text color="#616475" textAlign="center">
                        {Number(day.min_temp).toFixed(0)} °C
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        color="#e7e7eb"
                        textAlign="center"
                        fontWeight="normal"
                      >
                        {((Number(day.max_temp) * 9.0) / 5.0 + 32).toFixed(0)}
                        °F
                      </Text>
                      <Text color="#616475" textAlign="center">
                        {((Number(day.min_temp) * 9.0) / 5.0 + 32).toFixed(0)}
                        °F
                      </Text>
                    </>
                  )}
                </Center>
              );
            }
          })}
        </Flex>
        <Text fontWeight="bold" fontSize="2xl" color="white">
          Today's Highlights
        </Text>
        <Flex w="100%" justifyContent="space-between" m="30px 0">
          <Center {...todayHighlightProps}>
            <Text color="#e7e7eb" textAlign="center">
              Wind status
            </Text>
            <Text
              color="#e7e7eb"
              textAlign="center"
              fontWeight="bold"
              fontSize="6xl"
            >
              {Number(weatherData[0].wind_speed).toFixed(0)} mph
            </Text>
            <Center m="10px 0">
              <RiCompassDiscoverFill size="30px" rotate={70} color="#616475" />
              <Text color="#e7e7eb" textAlign="center" ml="10px">
                {weatherData[0].wind_direction_compass}
              </Text>
            </Center>
          </Center>
          <Center {...todayHighlightProps}>
            <Text color="#e7e7eb" textAlign="center">
              Humidity
            </Text>
            <Text
              color="#e7e7eb"
              textAlign="center"
              fontWeight="bold"
              fontSize="6xl"
            >
              {weatherData[0].humidity}%
            </Text>
            <Flex justifyContent="space-between" w="80%" m="0 45px">
              <Text color="#e7e7eb" textAlign="center">
                0
              </Text>
              <Text color="#e7e7eb" textAlign="center">
                50
              </Text>
              <Text color="#e7e7eb" textAlign="center">
                100
              </Text>
            </Flex>
            <Progress
              value={weatherData[0].humidity}
              w="80%"
              m="0px 45px"
              borderRadius="8px"
              colorScheme="yellow"
            />
            <Text color="#e7e7eb" textAlign="right" w="80%" m="0px 45px">
              %
            </Text>
          </Center>
        </Flex>
        <Flex justifyContent="space-between">
          <Center {...todayHighlightProps} h="150px">
            <Text color="#e7e7eb" textAlign="center">
              Visibility
            </Text>
            <Text
              color="#e7e7eb"
              textAlign="center"
              fontWeight="bold"
              fontSize="6xl"
            >
              {Number(weatherData[0].visibility).toFixed(1)} miles
            </Text>
          </Center>
          <Center {...todayHighlightProps} h="150px">
            <Text color="#e7e7eb" textAlign="center">
              Air Pressure
            </Text>
            <Text
              color="#e7e7eb"
              textAlign="center"
              fontWeight="bold"
              fontSize="6xl"
            >
              {Number(weatherData[0].air_pressure).toFixed(0)} mb
            </Text>
          </Center>
        </Flex>
      </Center>
    </Flex>
  );
};

export default IndexPage;
