import { useRef } from "react";
import { Heading, Input, Button, Box } from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";

export default function Game() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      <Heading className="font-is" size="md" mt={3} mb={3}>
        플레이 할 게임 수정
      </Heading>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          language: "ko_KR",
          plugins: ["link", "media", "image", "table"],
          toolbar:
            "undo redo | styles | bold italic forecolor backcolor | " +
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
