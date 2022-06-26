import "./App.css";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  ChakraProvider,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const loginProcess = () => {
    axios
      .post("http://localhost:9091/junharry/token", {
        user_id: userId,
        user_pw: userPw,
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          localStorage.setItem("junharry-token", Response.data.data.token);
          window.location.href = "/admin";
        } else {
          alert(Response.data.message);
        }
      })
      .catch((Response) => {
        alert(Response.response.data.message);
      });
  };

  return (
    <>
      <ChakraProvider>
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"} className="font-is">
                전해리 Admin 로그인
              </Heading>
              <Text fontSize={"md"} color={"gray.600"} className="font-is">
                아이디/비밀번호가 기억나지 않는다면 개발자에게 문의해주세요
              </Text>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="junharry-id">
                  <FormLabel className="font-is">아이디</FormLabel>
                  <Input
                    type="text"
                    placeholder="아이디를 입력해주세요"
                    className="font-is"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl id="junharry-password">
                  <FormLabel className="font-is">비밀번호</FormLabel>
                  <Input
                    type="password"
                    className="font-is"
                    placeholder="비밀번호를 입력해주세요 (8자 이상)"
                    value={userPw}
                    onChange={(e) => {
                      setUserPw(e.target.value);
                    }}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    mt={3}
                    bg={"blue.400"}
                    color={"white"}
                    className="font-is"
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={loginProcess}
                  >
                    로그인
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </ChakraProvider>
    </>
  );
}
