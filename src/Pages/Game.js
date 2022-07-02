import { useRef, useState, useEffect } from "react";
import { Heading, Input, Button, Box } from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

export default function Game({ apiUrl, toast }) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      saveGame(editorRef.current.getContent());
    }
  };

  const [game, setGame] = useState("");

  useEffect(() => {
    getGame();
  }, []);

  const getGame = () => {
    axios
      .get(apiUrl + "/junharry/plain/game")
      .then((Response) => {
        if (Response.data.code === "SUCCESS") {
          setGame(Response.data.data);
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

  const saveGame = (inputData) => {
    axios
      .put(
        apiUrl + "/junharry/plain",
        {
          key: "game",
          value: inputData,
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
          getGame();
        } else {
          toast({
            title: "실패",
            description: Response.data.message,
            position: "top-right",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((Error) => {
        toast({
          title: "실패",
          description: Error.message,
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.log(Error);
      });
  };

  return (
    <>
      <Heading className="font-is" size="md" mt={3} mb={3}>
        플레이 할 게임 수정
      </Heading>
      <Editor
        initialValue={game}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          language: "ko_KR",
          plugins: ["link", "media", "image", "table"],
          toolbar:
            "undo redo | fontsize | bold italic underline strikethrough forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "outdent indent hr | " +
            "link media image table | ",
        }}
        apiKey="2p1t8f6n851vczdur5zvpn6isucvqwaclzmykr388a0h6qzo"
      />
      <Box style={{ textAlign: "right" }} mt={2}>
        <Button colorScheme="blue" onClick={log}>
          수정
        </Button>
      </Box>
    </>
  );
}
