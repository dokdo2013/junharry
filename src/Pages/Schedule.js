import {
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Box,
  FormHelperText,
  Flex,
  Checkbox,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";

export default function Schedule({ apiUrl }) {
  const [scheduleDate, setScheduleDate] = useState(
    moment().hour(19).minute(0).second(0).format("YYYY-MM-DD[T]HH:mm:ss")
  );
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleIsRest, setScheduleIsRest] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const [alertIdx, setAlertIdx] = useState(0);
  const [alertDate, setAlertDate] = useState("");
  const [alertName, setAlertName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectYear, setSelectYear] = useState(moment().format("YYYY-MM"));

  const yearMinus = () => {
    setSelectYear(moment(selectYear).subtract(1, "months").format("YYYY-MM"));
  };
  const yearPlus = () => {
    setSelectYear(moment(selectYear).add(1, "months").format("YYYY-MM"));
  };

  const apiSetSchedule = () => {
    axios
      .post(
        apiUrl + "/junharry/schedule",
        {
          date: scheduleDate,
          name: scheduleName,
          is_rest: scheduleIsRest ? 1 : 0,
        },
        {
          headers: {
            "X-Access-Token": localStorage.getItem("junharry-token"),
          },
        }
      )
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          alert("등록 성공!");
          apiGetSchedule();
          setScheduleIsRest(false);
          setScheduleName("");
        } else {
          alert(Response.data.message);
          console.log(Response.data.message);
        }
      })
      .catch((Response) => {
        alert(Response.response.data.message);
      });
  };
  const apiGetSchedule = () => {
    axios.get(apiUrl + "/junharry/schedule").then((Response) => {
      if (Response.data.code === "SUCCESS") {
        setScheduleList(Response.data.data);
        console.log(Response.data.data);
      }
    });
  };
  const apiDeleteSchedule = (idx) => {
    axios
      .delete(apiUrl + "/junharry/schedule/" + idx, {
        headers: {
          "X-Access-Token": localStorage.getItem("junharry-token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          alert("삭제 성공!");
          apiGetSchedule();
          onClose();
        }
      })
      .catch((Response) => {
        alert(Response.response.data.message);
      });
  };

  const deleteConfirm = (idx, date, name) => {
    setAlertIdx(idx);
    setAlertDate(date);
    setAlertName(name);
    onOpen();
  };

  useEffect(() => {
    apiGetSchedule();
  }, []);

  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              정말 삭제하시겠습니까?
            </AlertDialogHeader>

            <AlertDialogBody>
              날짜 : {alertDate}
              <br />
              컨텐츠명 : {alertName}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>취소</Button>
              <Button
                colorScheme="red"
                onClick={() => apiDeleteSchedule(alertIdx)}
                ml={3}
              >
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Heading className="font-is" size="md" mt={3}>
        일정 추가
      </Heading>
      <SimpleGrid columns={2} spacing={2} mt={4}>
        <FormControl>
          <FormLabel htmlFor="schedule-datetime">날짜/시간 선택</FormLabel>
          <Input
            id="schedule-datetime"
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => {
              setScheduleDate(e.target.value);
            }}
          />
          <FormHelperText>
            입력창 우측의 달력 버튼을 누르면 날짜를 선택할 수 있어요
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="schedule-name">일정 내용 입력</FormLabel>
          <Input
            id="schedule-name"
            type="text"
            value={scheduleName}
            onChange={(e) => {
              setScheduleName(e.target.value);
            }}
          />
          <FormHelperText>진행할 컨텐츠를 입력해주세요</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <Flex justifyContent="flex-end" mt={2}>
        <Checkbox
          value={scheduleIsRest}
          onChange={(e) => {
            setScheduleIsRest(!scheduleIsRest);
          }}
        >
          이 일정은 휴방입니다
        </Checkbox>
        <Button colorScheme="blue" size="sm" ml={2} onClick={apiSetSchedule}>
          등록
        </Button>
      </Flex>
      <Heading className="font-is" size="md" mt={5} mb={5}>
        일정 조회
        <Box ml={4} style={{ display: "inline-flex" }}>
          <IconButton
            size="sm"
            mr={0}
            icon={<ChevronLeftIcon />}
            onClick={yearMinus}
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
          <Input
            type="month"
            w={120}
            size="sm"
            value={selectYear}
            onChange={(e) => {
              setSelectYear(e.target.value);
            }}
          />
          <IconButton
            size="sm"
            mr={0}
            icon={<ChevronRightIcon />}
            onClick={yearPlus}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
        </Box>
      </Heading>
      <Table size="sm" id="schedule-table">
        <Thead>
          <Tr>
            <Th>방송여부</Th>
            <Th>날짜</Th>
            <Th>컨텐츠명</Th>
            <Th>삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scheduleList.map((item) => {
            const day = moment(item.date).isoWeekday();
            const yoil = ["월", "화", "수", "목", "금", "토", "일"];
            if (moment(item.date).format("YYYY-MM") === selectYear)
              return (
                <Tr
                  key={item.idx}
                  style={
                    day === 6 || day === 7
                      ? { backgroundColor: "rgba(0,0,0,0.05)" }
                      : {}
                  }
                >
                  <Td>
                    {item.is_rest === 1 ? (
                      <Badge colorScheme="red">휴방</Badge>
                    ) : (
                      <Badge colorScheme="green">생방</Badge>
                    )}
                  </Td>
                  <Td>
                    {item.date} ({yoil[day - 1]})
                  </Td>
                  <Td>{item.name}</Td>
                  <Td>
                    <Button
                      colorScheme="red"
                      size="xs"
                      onClick={() =>
                        deleteConfirm(item.idx, item.date, item.name)
                      }
                    >
                      삭제
                    </Button>
                  </Td>
                </Tr>
              );
          })}
        </Tbody>
      </Table>
    </>
  );
}
