import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function Game() {
  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      mt={5}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        현재 준비 중인 메뉴입니다
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        곧 개발이 완료될 예정이에요. 조금만 더 기다려주세요!
      </AlertDescription>
    </Alert>
  );
}
