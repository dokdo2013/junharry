import { useState } from "react";
import Head from "next/head";
import {
  ChakraProvider,
  Heading,
  Container,
  Box,
  Flex,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  SimpleGrid,
  Checkbox,
} from "@chakra-ui/react";
import moment from "moment";

export default function admin() {
  // 일정 관리
  const [scheduleDate, setScheduleDate] = useState(
    moment().hour(19).minute(0).second(0).format("YYYY-MM-DD[T]HH:mm:ss")
  );
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleIsRest, setScheduleIsRest] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const apiSetSchedule = () => {};
  const apiGetSchedule = () => {};
  const apiDeleteSchedule = () => {};

  // 공지사항 관리
  // const [notice]

  return (
    <div className="admin">
      <Head>
        <title>전해리 방송일정 ADMIN</title>
        <meta name="description" content="전해리 방송일정" />
        <link
          rel="icon"
          href="https://imagedelivery.net/lR-z0ff8FVe1ydEi9nc-5Q/c552441f-f764-4e67-cd3f-1621da181a00/50x50"
        />
      </Head>

      <main>
        <ChakraProvider>
          <Box
            style={{
              backgroundColor: "white !important",
              minHeight: "100vh",
              padding: "20px",
            }}
          >
            <Container maxW="container.xl">
              <Flex justifyContent="space-between">
                <Heading size="lg" className="font-is">
                  전해리 Admin
                </Heading>
                <Button className="font-is" colorScheme="blue">
                  로그인
                </Button>
              </Flex>
              <Box mt={5}>
                <Tabs variant="soft-rounded" colorScheme="blue">
                  <TabList>
                    <Tab>일정 관리</Tab>
                    <Tab>공지사항 관리</Tab>
                    <Tab>게임 관리</Tab>
                    <Tab>유튜브 관리</Tab>
                    <Tab>링크 관리</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Heading className="font-is" size="md" mt={3}>
                        일정 추가
                      </Heading>
                      <SimpleGrid columns={2} spacing={2} mt={4}>
                        <FormControl>
                          <FormLabel htmlFor="schedule-datetime">
                            날짜/시간 선택
                          </FormLabel>
                          <Input
                            id="schedule-datetime"
                            type="datetime-local"
                            value={moment()
                              .hour(19)
                              .minute(0)
                              .second(0)
                              .format("YYYY-MM-DD[T]HH:mm:ss")}
                            onChange={() => {}}
                          />
                          <FormHelperText>
                            입력창 우측의 달력 버튼을 누르면 날짜를 선택할 수
                            있어요
                          </FormHelperText>
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="schedule-name">
                            일정 내용 입력
                          </FormLabel>
                          <Input id="schedule-name" type="text" />
                          <FormHelperText>
                            진행할 컨텐츠를 입력해주세요
                          </FormHelperText>
                        </FormControl>
                      </SimpleGrid>
                      <Flex justifyContent="flex-end" mt={2}>
                        <Checkbox>이 일정은 휴방입니다</Checkbox>
                        <Button colorScheme="blue" size="sm" ml={2}>
                          등록
                        </Button>
                      </Flex>
                      <Heading className="font-is" size="md" mt={5}>
                        일정 조회
                      </Heading>
                    </TabPanel>
                    <TabPanel>
                      <p>공지사항 관리</p>
                    </TabPanel>
                    <TabPanel>
                      <p>게임 관리</p>
                    </TabPanel>
                    <TabPanel>
                      <p>유튜브 관리</p>
                    </TabPanel>
                    <TabPanel>
                      <p>링크 관리</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Container>
          </Box>
        </ChakraProvider>
      </main>
    </div>
  );
}
