import {
  Heading,
  Input,
  Button,
  Box,
  Alert,
  AlertIcon,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  SimpleGrid,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";

export default function Youtube({ apiUrl, toast }) {
  const [scheduleDate, setScheduleDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formDate, setFormDate] = useState("");

  const [delYoutubeName, setDelYoutubeName] = useState("");
  const [delYoutubeDate, setDelYoutubeDate] = useState("");
  const [alertIdx, setAlertIdx] = useState(0);

  const [youtube, setYoutube] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getYoutube();
  }, []);

  const getYoutube = () => {
    axios
      .get(apiUrl + "/junharry/youtube?all=true")
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          setYoutube(Response.data.data);
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

  const saveYoutube = () => {
    axios
      .post(
        apiUrl + "/junharry/youtube",
        {
          name: formName,
          link: formUrl,
          cover_img: formImage,
          upload_date: formDate,
        },
        {
          headers: {
            "X-Access-Token": localStorage.getItem("junharry-token"),
          },
        }
      )
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          toast({
            title: "성공",
            description: Response.data.message,
            position: "top-right",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setFormDate("");
          setFormImage("");
          setFormName("");
          setFormUrl("");
          getYoutube();
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

  const deleteYoutube = () => {
    axios
      .delete(apiUrl + "/junharry/youtube/" + alertIdx, {
        headers: {
          "X-Access-Token": localStorage.getItem("junharry-token"),
        },
      })
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          toast({
            title: "성공",
            description: Response.data.message,
            position: "top-right",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          getYoutube();
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
        onClose();
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
        onClose();
      });
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              정말 삭제하시겠습니까?
            </AlertDialogHeader>

            <AlertDialogBody>
              영상 제목 : {delYoutubeName}
              <br />
              업로드날짜 : {delYoutubeDate}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>취소</Button>
              <Button
                colorScheme="red"
                onClick={() => deleteYoutube(alertIdx)}
                ml={3}
              >
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Alert status="info">
        <AlertIcon />
        유튜브 표출은
        <Text fontWeight="bold" mx={1}>
          업로드 일자 기준 최신순 3건
        </Text>
        입니다.
      </Alert>

      <Heading className="font-is" size="md" mt={6} mb={3}>
        유튜브 등록
      </Heading>

      <SimpleGrid columns={2} spacing={2} mt={4}>
        <FormControl mb={5}>
          <FormLabel htmlFor="youtube-name">영상 제목</FormLabel>
          <Input
            id="youtube-name"
            type="text"
            mb={1}
            placeholder="제목을 입력해주세요"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
            }}
          />
          <FormHelperText>
            유튜브에 업로드된 영상 제목을 입력해주세요
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="youtube-url">유튜브 링크</FormLabel>
          <Input
            id="youtube-url"
            type="text"
            mb={1}
            placeholder="유튜브 링크를 입력해주세요"
            value={formUrl}
            onChange={(e) => {
              setFormUrl(e.target.value);
            }}
          />
          <FormHelperText>유튜브 영상 링크를 입력해주세요</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="youtube-image">썸네일 이미지 링크</FormLabel>
          <Input
            id="youtube-image"
            type="text"
            mb={1}
            placeholder="썸네일 이미지 링크를 입력해주세요"
            value={formImage}
            onChange={(e) => {
              setFormImage(e.target.value);
            }}
          />
          <FormHelperText>
            <a
              href="http://www.get-youtube-thumbnail.com/"
              target="_blank"
              rel="noreferrer"
            >
              썸네일 링크 추출하러 가기 (링크)
            </a>
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="youtube-date">업로드 날짜 선택</FormLabel>
          <Input
            id="youtube-date"
            type="date"
            value={formDate}
            onChange={(e) => {
              setFormDate(e.target.value);
            }}
          />
          <FormHelperText>
            입력창 우측의 달력 버튼을 누르면 날짜를 선택할 수 있어요
          </FormHelperText>
        </FormControl>
      </SimpleGrid>

      <Box style={{ textAlign: "right" }} mt={2}>
        <Button
          colorScheme="blue"
          onClick={() => {
            if (
              formName === "" ||
              formUrl === "" ||
              formImage === "" ||
              formDate === ""
            ) {
              toast({
                title: "오류",
                description: "빈칸이 있습니다",
                position: "top-right",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              saveYoutube();
            }
          }}
        >
          등록
        </Button>
      </Box>

      <Heading className="font-is" size="md" mt={6} mb={3}>
        유튜브 목록
      </Heading>
      <Table id="youtube-table">
        <Thead>
          <Tr>
            <Th>업로드 날짜</Th>
            <Th>제목</Th>
            <Th>썸네일</Th>
            <Th>링크</Th>
            <Th>삭제</Th>
          </Tr>
        </Thead>
        <Tbody>
          {youtube.map((item) => (
            <Tr key={item.idx}>
              <Td>{item.upload_date}</Td>
              <Td>{item.name}</Td>
              <Td>
                <Image w={200} src={item.cover_img}></Image>
              </Td>
              <Td>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    window.open(item.link, "_blank");
                  }}
                >
                  링크 열기
                </Button>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setAlertIdx(item.idx);
                    setDelYoutubeName(item.name);
                    setDelYoutubeDate(item.upload_date);
                    onOpen();
                  }}
                >
                  삭제
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
