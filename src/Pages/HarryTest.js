import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  Heading,
  Badge,
  Text,
} from "@chakra-ui/react";

const HarryTest = ({ apiUrl, toast }) => {
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const [testData, setTestData] = useState([]);

  const [drawerUser, setDrawerUser] = useState([]);
  const [drawerResult, setDrawerResult] = useState([]);

  const popUser = [188643459, 789278221, 798123164, 178323155, 726441337];

  const getApi = () => {
    axios
      .get(apiUrl + "/junharry/test", {
        headers: {
          "X-Access-Token": localStorage.getItem("junharry-token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          // 점수로 정렬하기
          const data = Response.data.data;
          const sortedData = data.sort((a, b) => {
            return b.score - a.score;
          });

          // 유저 제외
          const filteredData = sortedData.filter((item) => {
            return !popUser.includes(item.user.user_id);
          });

          setTestData(filteredData);
        } else {
          toast({
            title: "오류",
            description: Response.data.message,
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "오류",
          description: error.response.data.message,
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const resultOpen = (user_idx) => {
    // 데이터 조회
    axios
      .get(apiUrl + `/junharry/test/result/${user_idx}`, {
        headers: {
          "X-Access-Token": localStorage.getItem("junharry-token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          setDrawerResult(Response.data.data.result.test_data);
          onOpen2();
        } else {
          toast({
            title: "오류",
            description: "API 호출 중 오류가 발생했습니다.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "오류",
          description: "API 호출 중 오류가 발생했습니다.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });

    // Drawer 열기
  };

  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      <Drawer isOpen={isOpen1} placement="right" size="lg" onClose={onClose1}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>유저 상세정보</DrawerHeader>

          <DrawerBody>
            <Table>
              <Tbody>
                <Tr>
                  <Td fontWeight="bold">프로필 이미지</Td>
                  <Td>
                    <Avatar size="md" src={drawerUser.user_profile_image_url} />
                  </Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">아이디</Td>
                  <Td>{drawerUser.user_name}</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">닉네임</Td>
                  <Td>{drawerUser.user_display_name}</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">이메일</Td>
                  <Td>{drawerUser.user_email}</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">설명</Td>
                  <Td>{drawerUser.user_description}</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold">트위치 가입일</Td>
                  <Td>{drawerUser.user_created_at}</Td>
                </Tr>
              </Tbody>
            </Table>
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} onClick={onClose1}>
              닫기
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer isOpen={isOpen2} placement="right" size="lg" onClose={onClose2}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>문제 풀이 상세</DrawerHeader>

          <DrawerBody>
            <Box>
              {drawerResult.map((item, index) => {
                return (
                  <Box key={index} my={5}>
                    <Heading size="sm">
                      {index + 1}. {item.question}
                      <Badge
                        colorScheme={
                          item.user_answer === item.correct_answer
                            ? "green"
                            : "red"
                        }
                      >
                        {item.user_answer === item.correct_answer
                          ? "맞았어요"
                          : "틀렸어요"}
                      </Badge>
                    </Heading>
                    <Box my={2}>
                      <Text className="font-leferi">
                        정답:{" "}
                        {
                          item.answers[0].find(
                            (answer) => answer.idx === item.correct_answer
                          ).content
                        }
                      </Text>
                      <Text className="font-leferi">
                        선택:{" "}
                        {
                          item.answers[0].find(
                            (answer) => answer.idx === item.user_answer
                          ).content
                        }
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} onClick={onClose2}>
              닫기
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>순위</Th>
              <Th>유저정보</Th>
              <Th>점수</Th>
              <Th>유저상세</Th>
              <Th>풀이상세</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testData.map((data, idx) => (
              <Tr key={idx}>
                <Td>{idx + 1}</Td>
                <Td>
                  <Avatar src={data.user.user_profile_image_url} size="xs" />{" "}
                  {data.user.user_display_name} ({data.user.user_name})
                </Td>
                <Td>{data.score}</Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => {
                      setDrawerUser(data.user);
                      onOpen1();
                    }}
                  >
                    유저상세
                  </Button>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => {
                      resultOpen(data.user.user_id);
                    }}
                  >
                    풀이상세
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </>
  );
};

export default HarryTest;
