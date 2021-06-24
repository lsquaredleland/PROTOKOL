import styled from "styled-components";
import { useNotification } from "contexts/Notification";

interface ErrorWindowProps {
  messageOverride?: string;
}

const ErrorWindow = ({ messageOverride = "" }: ErrorWindowProps) => {
  const { notification: { title, child, copy, message }, updateNotification } = useNotification();
  const msg: string | undefined = messageOverride || message;
  const isVisible = (msg && msg.length > 0) || child || copy;

  const clear = () => {
    updateNotification({
      child: undefined,
      title: "",
      message: "",
      copy: "",
    });
  }

  const wrapper = (
    <Wrapper>
      <span onClick={clear}>{title}</span>
      <div>{msg}</div>
      {child}
    </Wrapper>
  );

  return isVisible ? wrapper : <></>;
};

const Wrapper = styled.div`
  position: absolute;
  margin: auto;
  z-index: 100;
  top: 20%;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;

  width: 300px;
  height: 200px;
  background: white;
  border: 2px solid black;
`;

export default ErrorWindow;
